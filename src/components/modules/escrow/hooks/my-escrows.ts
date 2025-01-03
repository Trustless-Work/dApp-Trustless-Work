import { Escrow } from "@/@types/escrow.entity";
import { useState } from "react";

interface useMyEscrowsProps {
  escrowData: Escrow[];
}

const useMyEscrows = ({ escrowData }: useMyEscrowsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const totalPages = Math.ceil(escrowData.length / itemsPerPage);
  const currentData = escrowData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
  };
};

export default useMyEscrows;
