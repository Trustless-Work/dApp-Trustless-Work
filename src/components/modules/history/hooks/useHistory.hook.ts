import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistoryQuery } from "./useHistoryQuery";
import { HistoryItem, HistoryFilters } from "../@types/history.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "@/components/modules/escrow/store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";

export const useHistory = () => {
  const { t } = useTranslation();
  const { address } = useGlobalAuthenticationStore();

  // Dialog states
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  // Local state
  const [activeTab, setActiveTab] = useState("approver");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [filters, setFilters] = useState<HistoryFilters>({
    search: "",
    status: "all",
    activityType: "all",
  });

  // Fetch history data
  const {
    data: historyData = [],
    isLoading,
    error,
  } = useHistoryQuery({
    type: activeTab,
    limit: 100,
  });

  // Filter and paginate data
  const filteredData = useMemo(() => {
    return historyData.filter((item: HistoryItem) => {
      const matchesSearch =
        !filters.search ||
        item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        (filters.status === "released" && item.flags?.released) ||
        (filters.status === "resolved" && item.flags?.resolved) ||
        (filters.status === "disputed" && item.flags?.disputed) ||
        (filters.status === "active" &&
          !item.flags?.released &&
          !item.flags?.resolved &&
          !item.flags?.disputed);

      const matchesActivityType =
        !filters.activityType ||
        filters.activityType === "all" ||
        item.activityType === filters.activityType;

      return matchesSearch && matchesStatus && matchesActivityType;
    });
  }, [historyData, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      activityType: "all",
    });
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  const handleActivityTypeChange = (value: string) => {
    setFilters({ ...filters, activityType: value });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return {
    // Data
    data: paginatedData,
    isLoading,
    error,
    totalPages,

    // State
    activeTab,
    currentPage,
    itemsPerPage,
    filters,
    isDialogOpen,

    // Handlers
    handleClearFilters,
    handleTabChange,
    handleSearchChange,
    handleStatusChange,
    handleActivityTypeChange,
    handlePageChange,
    handleItemsPerPageChange,
    setIsDialogOpen,
    setSelectedEscrow,

    // Utils
    t,
    address,
  };
};
