import { Milestone } from "@/@types/escrows/escrow.entity";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";

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
  const activeParam = searchParams.get("active"); // ← 👈

  const isActive =
    activeParam === "trashed" ? false : activeParam === "active" ? true : true;

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

      const completedMilestones = escrow.milestones.filter(
        (milestone: Milestone) => milestone.status === "completed",
      ).length;

      const approvedMilestones = escrow.milestones.filter(
        (milestone: Milestone) => milestone.approvedFlag === true,
      ).length;

      const totalMilestones = escrow.milestones.length;

      const progressPercentageCompleted =
        totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

      const progressPercentageApproved =
        totalMilestones > 0 ? (approvedMilestones / totalMilestones) * 100 : 0;

      const pendingRelease =
        progressPercentageCompleted === 100 &&
        progressPercentageApproved === 100 &&
        !escrow.flags?.releaseFlag;

      let matchesStatus = true;
      if (statusFilter && statusFilter !== "all") {
        switch (statusFilter) {
          case "working":
            matchesStatus =
              !escrow.flags?.releaseFlag &&
              !escrow.flags?.resolvedFlag &&
              !pendingRelease;
            break;
          case "pendingRelease":
            matchesStatus = pendingRelease;
            break;
          case "released":
            matchesStatus = escrow.flags?.releaseFlag === true;
            break;
          case "resolved":
            matchesStatus = escrow.flags?.resolvedFlag === true;
            break;
          case "inDispute":
            matchesStatus = escrow.flags?.disputeFlag === true;
            break;
          default:
            matchesStatus = true;
        }
      }

      const matchesEngagement =
        !engagementFilter || escrow.engagementId === engagementFilter;

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
    const fetchKey = `${address}-${type}-${isActive}`;
    if (fetchKey === lastFetchKey.current) return;
    try {
      fetchingRef.current = true;
      lastFetchKey.current = fetchKey;
      setIsLoading(true);
      await fetchAllEscrows({ address, type, isActive });
    } catch (error: unknown) {
      console.error("[MyEscrows] Error fetching escrows:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [address, type, isActive, fetchAllEscrows]);

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
