"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ESCROWS_PAGE_SIZE,
  escrowDetailQueryKey,
  escrowsQueryKey,
} from "@/features/escrows/constants/escrow.constants";
import { localEscrowRepository } from "@/features/escrows/services/escrow-repository";
import type {
  EscrowFilters,
  EscrowType,
} from "@/features/escrows/types/escrow.types";
import { matchesEscrowFilterStatus } from "@/features/escrows/utils/escrow-display.helper";
import { useWalletContext } from "@/providers/WalletProvider";

export function useEscrowsList() {
  const { walletAddress, hasWalletHydrated } = useWalletContext();

  return useQuery({
    queryKey: escrowsQueryKey(walletAddress),
    queryFn: () =>
      walletAddress ? localEscrowRepository.list(walletAddress) : [],
    enabled: Boolean(hasWalletHydrated && walletAddress),
  });
}

export function useEscrowDetail(contractId: string) {
  const { walletAddress, hasWalletHydrated } = useWalletContext();

  const query = useQuery({
    queryKey: escrowDetailQueryKey(contractId, walletAddress),
    queryFn: () =>
      walletAddress
        ? localEscrowRepository.getByContractId(contractId, walletAddress)
        : null,
    enabled: Boolean(hasWalletHydrated && walletAddress && contractId),
  });

  const isResolving =
    !hasWalletHydrated ||
    (Boolean(walletAddress && contractId) &&
      (query.isPending || query.isFetching));

  return {
    ...query,
    isResolving,
  };
}

type UseEscrowsParams = {
  escrowType: EscrowType;
  filters: EscrowFilters;
  page: number;
};

export function useEscrows({ escrowType, filters, page }: UseEscrowsParams) {
  const { walletAddress, hasWalletHydrated } = useWalletContext();
  const { data = [], isPending, isFetching } = useEscrowsList();

  const isResolving =
    !hasWalletHydrated ||
    (Boolean(walletAddress) && (isPending || isFetching));

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return data
      .filter((escrow) => escrow.type === escrowType)
      .filter((escrow) => matchesEscrowFilterStatus(escrow, filters.status))
      .filter((escrow) => {
        if (!search) {
          return true;
        }

        return (
          escrow.title.toLowerCase().includes(search) ||
          escrow.engagementId.toLowerCase().includes(search)
        );
      });
  }, [data, escrowType, filters.search, filters.status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ESCROWS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ESCROWS_PAGE_SIZE,
    currentPage * ESCROWS_PAGE_SIZE,
  );

  return {
    escrows: paginated,
    total: filtered.length,
    totalPages,
    currentPage,
    isLoading: isResolving,
    isFetching,
  };
}
