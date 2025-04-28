import { WalletError } from "@/@types/errors.entity";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { toast } from "@/hooks/toast.hook";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

interface useMyEscrowsProps {
  type: string;
}

const useMyEscrows = ({ type }: useMyEscrowsProps) => {
  const { address } = useGlobalAuthenticationStore();
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const escrows = useGlobalBoundedStore((state) => state.escrows);
  const totalEscrows = useGlobalBoundedStore((state) => state.totalEscrows);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef(false);
  const lastFetchKey = useRef("");

  // Filters and pagination
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const statusFilter = searchParams.get("status") || "";
  const amountFilter = searchParams.get("amount") || "";
  const engagementFilter = searchParams.get("engagement") || "";
  const dateRangeFilter = searchParams.get("dateRange") || "";

  // Date range
  const [startStr, endStr] = dateRangeFilter.split("_");
  const startDate = startStr ? new Date(startStr) : null;
  const endDate = endStr ? new Date(endStr) : null;

  const totalPages = Math.ceil(totalEscrows / itemsPerPage);

  const currentData = useMemo(() => {
    if (!escrows) return [];

    const sorted = [...escrows].sort((a, b) => {
      const aTimestamp = a.updatedAt || a.createdAt;
      const bTimestamp = b.updatedAt || b.createdAt;

      const aDate = new Date(
        aTimestamp.seconds * 1000 + aTimestamp.nanoseconds / 1e6,
      );
      const bDate = new Date(
        bTimestamp.seconds * 1000 + bTimestamp.nanoseconds / 1e6,
      );

      return bDate.getTime() - aDate.getTime();
    });

    const filtered = sorted.filter((escrow) => {
      const matchesSearch =
        !searchQuery ||
        escrow.title?.toLowerCase().includes(searchQuery) ||
        escrow.description?.toLowerCase().includes(searchQuery);

      // todo: use these constants in zusntand
      const completedMilestones = escrow.milestones.filter(
        (milestone) => milestone.status === "completed",
      ).length;

      const approvedMilestones = escrow.milestones.filter(
        (milestone) => milestone.approved_flag === true,
      ).length;

      const totalMilestones = escrow.milestones.length;

      const progressPercentageCompleted =
        totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

      const progressPercentageApproved =
        totalMilestones > 0 ? (approvedMilestones / totalMilestones) * 100 : 0;

      // Check if both are 100% and releaseFlag is false
      const pendingRelease =
        progressPercentageCompleted === 100 &&
        progressPercentageApproved === 100 &&
        !escrow.releaseFlag;

      // Flags
      let matchesStatus = true;
      if (statusFilter && statusFilter !== "all") {
        switch (statusFilter) {
          case "working":
            matchesStatus =
              !escrow.releaseFlag && !escrow.resolvedFlag && !pendingRelease;
            break;
          case "pendingRelease":
            matchesStatus = pendingRelease;
            break;
          case "released":
            matchesStatus = escrow.releaseFlag === true;
            break;
          case "resolved":
            matchesStatus = escrow.resolvedFlag === true;
            break;
          case "inDispute":
            matchesStatus = escrow.disputeFlag === true;
            break;
          default:
            matchesStatus = true;
        }
      }

      // Engagement
      const matchesEngagement =
        !engagementFilter || escrow.engagementId === engagementFilter;

      // Amount
      let matchesAmount = true;
      const amount = parseFloat(escrow.amount);
      if (!isNaN(amount) && amountFilter && amountFilter !== "all") {
        if (amountFilter.includes("+")) {
          const min = parseFloat(amountFilter.replace("+", ""));
          matchesAmount = amount >= min;
        } else {
          const [min, max] = amountFilter.split("-").map(Number);
          matchesAmount = amount >= min && amount <= max;
        }
      }

      // Date Range
      const createdAt = new Date(escrow.createdAt.seconds * 1000);

      const matchesDate =
        (!startDate || createdAt >= startDate) &&
        (!endDate || createdAt <= endDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAmount &&
        matchesEngagement &&
        matchesDate
      );
    });

    return filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [
    escrows,
    searchQuery,
    statusFilter,
    amountFilter,
    engagementFilter,
    dateRangeFilter,
    currentPage,
    itemsPerPage,
  ]);

  const memoizedFetchEscrows = useCallback(async () => {
    if (!address || fetchingRef.current) return;
    const fetchKey = `${address}-${type}`;
    if (fetchKey === lastFetchKey.current) return;
    try {
      fetchingRef.current = true;
      lastFetchKey.current = fetchKey;
      setIsLoading(true);
      await fetchAllEscrows({ address, type });
    } catch (error: unknown) {
      console.error("[MyEscrows] Error fetching escrows:", error);
      toast({
        title: "Error fetching escrows",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [address, type, fetchAllEscrows]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        memoizedFetchEscrows();
      }, 100);
    };

    debouncedFetch();

    return () => {
      clearTimeout(timeoutId);
      fetchingRef.current = false;
    };
  }, [memoizedFetchEscrows]);

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };

  const itemsPerPageOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  return {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    itemsPerPageOptions,
    toggleRowExpansion,
    expandedRows,
    isLoading,
  };
};

export default useMyEscrows;
