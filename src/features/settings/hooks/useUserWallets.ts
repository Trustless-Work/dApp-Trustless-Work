"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/features/settings/services/wallet.service";

export const USER_WALLETS_QUERY_KEY = ["user", "wallets"] as const;

export function useUserWallets() {
  const query = useQuery({
    queryKey: USER_WALLETS_QUERY_KEY,
    queryFn: () => walletService.listWallets(),
    staleTime: 1000 * 60,
  });

  const verifiedWallets = useMemo(
    () => (query.data ?? []).filter((wallet) => wallet.verified),
    [query.data],
  );

  const pendingWallets = useMemo(
    () => (query.data ?? []).filter((wallet) => !wallet.verified),
    [query.data],
  );

  return {
    ...query,
    wallets: query.data ?? [],
    verifiedWallets,
    pendingWallets,
    verifiedCount: verifiedWallets.length,
  };
}
