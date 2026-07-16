import type { QueryClient } from "@tanstack/react-query";
import {
  ESCROWS_LIST_QUERY_ROOT,
  escrowDetailQueryKey,
} from "@/features/escrows/constants/escrow.constants";

/** Delays for follow-up refetches while the read-model catches up after on-chain txs. */
export const ESCROW_INDEXER_CATCH_UP_DELAYS_MS = [2_000, 5_000, 10_000] as const;

export async function refreshEscrowQueries(
  queryClient: QueryClient,
  contractId: string,
): Promise<void> {
  await Promise.all([
    queryClient.refetchQueries({
      queryKey: ESCROWS_LIST_QUERY_ROOT,
      type: "active",
    }),
    queryClient.refetchQueries({
      queryKey: escrowDetailQueryKey(contractId),
      type: "active",
    }),
  ]);
}

export function scheduleEscrowIndexerCatchUp(
  queryClient: QueryClient,
  contractId: string,
): void {
  const detailKey = escrowDetailQueryKey(contractId);

  for (const delayMs of ESCROW_INDEXER_CATCH_UP_DELAYS_MS) {
    setTimeout(() => {
      void queryClient.refetchQueries({
        queryKey: detailKey,
        type: "active",
      });
      void queryClient.refetchQueries({
        queryKey: ESCROWS_LIST_QUERY_ROOT,
        type: "active",
      });
    }, delayMs);
  }
}
