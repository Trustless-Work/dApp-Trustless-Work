import { Role } from "@trustless-work/escrow/types";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useRef } from "react";
import { useEscrowsByRoleQuery } from "./tanstack/useEscrowsByRoleQuery";
import { SingleReleaseEscrowStatus } from "@/@types/escrow.entity";

interface useMyEscrowsProps {
  role: Role;
}

const useMyEscrows = ({ role }: useMyEscrowsProps) => {
  const { address } = useGlobalAuthenticationStore();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const lastQueryKey = useRef<string>("");
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";
    const statusFilter = searchParams.get("status") || "";
    const amountFilter = searchParams.get("amount") || "";
    const engagementFilter = searchParams.get("engagement") || "";
    const dateRangeFilter = searchParams.get("dateRange") || "";
    const activeParam = searchParams.get("active");

    const isActive =
      activeParam === "trashed"
        ? false
        : activeParam === "active"
          ? true
          : true;

    return {
      searchQuery,
      statusFilter,
      amountFilter,
      engagementFilter,
      dateRangeFilter,
      isActive,
    };
  }, [searchParams]);

  const queryParams = useMemo(() => {
    const {
      searchQuery,
      statusFilter,
      amountFilter,
      engagementFilter,
      dateRangeFilter,
      isActive,
    } = filters;

    return {
      role,
      roleAddress: address,
      isActive,
      page: currentPage,
      orderDirection: "desc" as const,
      orderBy: "updatedAt" as const,
      startDate: dateRangeFilter.split("_")[0],
      endDate: dateRangeFilter.split("_")[1],
      maxAmount: amountFilter.includes("+")
        ? parseFloat(amountFilter.replace("+", ""))
        : undefined,
      minAmount: amountFilter.includes("-")
        ? parseFloat(amountFilter.split("-")[0])
        : undefined,
      title: searchQuery,
      engagementId: engagementFilter,
      status: statusFilter as SingleReleaseEscrowStatus,
    };
  }, [role, address, currentPage, filters]);

  const queryKey = useMemo(() => {
    return JSON.stringify(queryParams);
  }, [queryParams]);

  const hasQueryChanged = queryKey !== lastQueryKey.current;

  const { data: escrows = [], isLoading } = useEscrowsByRoleQuery(queryParams);

  if (hasQueryChanged) {
    lastQueryKey.current = queryKey;
  }

  const totalPages = useMemo(() => {
    return Math.ceil(escrows.length / itemsPerPage);
  }, [escrows, itemsPerPage]);

  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  }, []);

  const itemsPerPageOptions = useMemo(
    () => [
      { value: 10, label: "10" },
      { value: 20, label: "20" },
      { value: 30, label: "30" },
      { value: 40, label: "40" },
      { value: 50, label: "50" },
    ],
    [],
  );

  const setItemsPerPageCallback = useCallback((value: number) => {
    setItemsPerPage(value);
  }, []);

  const setCurrentPageCallback = useCallback((value: number) => {
    setCurrentPage(value);
  }, []);

  return {
    escrows,
    currentPage,
    itemsPerPage,
    itemsPerPageOptions,
    totalPages,
    expandedRows,
    isLoading,
    setItemsPerPage: setItemsPerPageCallback,
    setCurrentPage: setCurrentPageCallback,
    toggleRowExpansion,
  };
};

export default useMyEscrows;
