import { Role } from "@trustless-work/escrow/types";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useEscrowsByRoleQuery } from "./tanstack/useEscrowsByRoleQuery";
import { useEscrowsBySignerQuery } from "./tanstack/useEscrowsBySignerQuery";
import { SingleReleaseEscrowStatus } from "@/@types/escrow.entity";

interface useMyEscrowsProps {
  role: Role;
}

function useEscrowsFlexibleQuery({
  role,
  roleAddress,
  signer,
  ...baseParams
}: any) {
  if (role === "signer") {
    return useEscrowsBySignerQuery({
      ...baseParams,
      signer,
    });
  } else {
    return useEscrowsByRoleQuery({
      ...baseParams,
      role,
      roleAddress,
    });
  }
}

const useMyEscrows = ({ role }: useMyEscrowsProps) => {
  const { address } = useGlobalAuthenticationStore();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

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

  const baseParams = useMemo(() => {
    const {
      searchQuery,
      statusFilter,
      amountFilter,
      engagementFilter,
      dateRangeFilter,
      isActive,
    } = filters;

    return {
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
  }, [currentPage, filters]);

  const { data: allEscrows = [], isLoading } = useEscrowsFlexibleQuery({
    ...baseParams,
    role,
    roleAddress: address,
    signer: address,
  });

  const totalItems = allEscrows.length;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const escrows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allEscrows.slice(startIndex, endIndex);
  }, [allEscrows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const setItemsPerPageCallback = useCallback(
    (value: number) => {
      // Validate items per page
      const validValues = itemsPerPageOptions.map((option) => option.value);
      if (validValues.includes(value)) {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
      }
    },
    [itemsPerPageOptions],
  );

  const setCurrentPageCallback = useCallback(
    (value: number) => {
      // Validate page number
      if (value < 1) {
        setCurrentPage(1);
      } else if (value > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(value);
      }
    },
    [totalPages],
  );

  return {
    escrows,
    currentPage,
    itemsPerPage,
    itemsPerPageOptions,
    totalPages,
    totalItems,
    expandedRows,
    isLoading,
    setItemsPerPage: setItemsPerPageCallback,
    setCurrentPage: setCurrentPageCallback,
    toggleRowExpansion,
  };
};

export default useMyEscrows;
