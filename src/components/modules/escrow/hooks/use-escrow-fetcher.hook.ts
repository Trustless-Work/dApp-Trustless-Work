import { useEffect } from "react";
import { useFetchEscrows } from "./use-fetch-escrows.hook";
import { useGlobalBoundedStore } from "@/core/store/data";

interface UseEscrowFetcherProps {
  address: string;
  type: string;
  isActive?: boolean;
}

export const useEscrowFetcher = ({
  address,
  type,
  isActive,
}: UseEscrowFetcherProps) => {
  const { fetchAllEscrows } = useFetchEscrows();
  const setEscrows = useGlobalBoundedStore((state) => state.setEscrows);

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        const escrows = await fetchAllEscrows({ address, type, isActive });
        setEscrows(escrows);
      } catch (error) {
        console.error("Error fetching escrows:", error);
      }
    };

    if (address) {
      fetchEscrows();
    }
  }, [address, type, isActive, fetchAllEscrows, setEscrows]);
};
