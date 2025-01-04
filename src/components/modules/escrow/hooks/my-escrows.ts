import { useWalletStore } from "@/store/walletStore/store";
import { useState, useEffect, useMemo } from "react";
import { getAllEscrowsByUser } from "../server/escrow-firebase";
import { Escrow } from "@/@types/escrow.entity";

const useMyEscrows = () => {
  const { address } = useWalletStore();

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [fetchedEscrows, setFetchedEscrows] = useState<Escrow[]>([]);

  const totalPages = Math.ceil(fetchedEscrows.length / itemsPerPage);

  const currentData = useMemo(() => {
    return fetchedEscrows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [fetchedEscrows, currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchEscrows = async () => {
      if (address) {
        const res = await getAllEscrowsByUser({ address });
        setFetchedEscrows(res.data);
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
