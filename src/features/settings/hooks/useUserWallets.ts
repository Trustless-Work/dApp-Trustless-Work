"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { walletService } from "@/features/settings/services/wallet.service";
import { flattenKeysetPages } from "@/lib/pagination";
import { DEFAULT_KEYSET_LIMIT } from "@/types/pagination.entity";

export const USER_WALLETS_QUERY_KEY = ["user", "wallets"] as const;

export function useUserWallets() {
  const query = useInfiniteQuery({
    queryKey: USER_WALLETS_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      walletService.listWalletsPage({
        limit: DEFAULT_KEYSET_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 60,
  });

  const wallets = useMemo(() => flattenKeysetPages(query.data), [query.data]);

  const verifiedWallets = useMemo(
    () => wallets.filter((wallet) => wallet.verified),
    [wallets],
  );

  const pendingWallets = useMemo(
    () => wallets.filter((wallet) => !wallet.verified),
    [wallets],
  );

  return {
    ...query,
    wallets,
    verifiedWallets,
    pendingWallets,
    verifiedCount: verifiedWallets.length,
  };
}
