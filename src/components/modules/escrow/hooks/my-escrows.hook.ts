import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
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

    return sorted.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [escrows, currentPage, itemsPerPage]);

  const memoizedFetchEscrows = useCallback(async () => {
    if (!address || fetchingRef.current) return;
    const fetchKey = `${address}-${type}`;
    if (fetchKey === lastFetchKey.current) return;
    try {
      fetchingRef.current = true;
      lastFetchKey.current = fetchKey;
      setIsLoading(true);
      await fetchAllEscrows({ address, type });
    } catch (error) {
      console.error("[MyEscrows] Error fetching escrows:", error);
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
