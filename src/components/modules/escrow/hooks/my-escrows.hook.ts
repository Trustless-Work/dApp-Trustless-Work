import { useWalletStore } from "@/store/walletStore/store";
import { useState, useEffect, useMemo } from "react";
import { useGlobalBoundedStore } from "@/core/store";

const useMyEscrows = () => {
  const { address } = useWalletStore();
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const escrows = useGlobalBoundedStore((state) => state.escrows);
  const totalEscrows = useGlobalBoundedStore((state) => state.totalEscrows);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const totalPages = Math.ceil(totalEscrows / itemsPerPage);

  const currentData = useMemo(() => {
    return escrows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [escrows, currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchEscrows = async () => {
      if (address) {
        fetchAllEscrows({ address, type: "client" });
      }
    };

    fetchEscrows();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
    handlePageChange,
    setItemsPerPage,
    setCurrentPage,
    itemsPerPageOptions,
    toggleRowExpansion,
    expandedRows,
  };
};

export default useMyEscrows;
