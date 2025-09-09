import { Role } from "@trustless-work/escrow/types";
import { useGlobalAuthenticationStore } from "@/store/data";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useEscrowsByRoleQuery } from "./tanstack/useEscrowsByRoleQuery";
import { useEscrowsBySignerQuery } from "./tanstack/useEscrowsBySignerQuery";
import { SingleReleaseEscrowStatus } from "@/types/escrow.entity";

interface useMyEscrowsProps {
  role: Role;
}

interface BaseParams {
  isActive: boolean;
  page: number;
  orderDirection: "desc";
  orderBy: "updatedAt";
  startDate?: string;
  endDate?: string;
  maxAmount?: number;
  minAmount?: number;
  title?: string;
  engagementId?: string;
  status?: SingleReleaseEscrowStatus;
}

interface FlexibleQueryParams extends BaseParams {
  role: Role;
  roleAddress: string;
  signer: string;
}

function useEscrowsFlexibleQuery({
  role,
  roleAddress,
  signer,
  ...baseParams
}: FlexibleQueryParams) {
  const signerQuery = useEscrowsBySignerQuery({
    ...baseParams,
    signer,
    enabled: role === "signer",
  });

  const roleQuery = useEscrowsByRoleQuery({
    ...baseParams,
    role,
    roleAddress,
    enabled: role !== "signer",
  });

  if (role === "signer") {
    return signerQuery;
  } else {
    return roleQuery;
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
      engagementFilter,
      dateRangeFilter,
      isActive,
    };
  }, [searchParams]);

  const baseParams = useMemo(() => {
    const { searchQuery, engagementFilter, dateRangeFilter, isActive } = filters;

    // Parse date range (now stored as YYYY-MM-DD_YYYY-MM-DD)
    let startDate: string | undefined;
    let endDate: string | undefined;
    if (dateRangeFilter) {
      const [s, e] = dateRangeFilter.split("_");
      if (s) startDate = s;
      if (e) endDate = e;
    }

    // Map engagement: omit when empty
    const engagementId = engagementFilter || undefined;

    return {
      isActive,
      page: currentPage,
      orderDirection: "desc" as const,
      orderBy: "updatedAt" as const,
      startDate,
      endDate,
      title: searchQuery,
      engagementId,
      // Explicitly omit min/max amount and status filters
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
      const validOptions = [10, 20, 30, 40, 50];
      if (!validOptions.includes(value)) {
        setItemsPerPage(15);
      } else {
        setItemsPerPage(value);
      }
      setCurrentPage(1);
    },
    [],
  );

  return {
    escrows,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    isLoading,
    expandedRows,
    setItemsPerPage: setItemsPerPageCallback,
    setCurrentPage,
    toggleRowExpansion,
    itemsPerPageOptions,
  };
};

export default useMyEscrows;
