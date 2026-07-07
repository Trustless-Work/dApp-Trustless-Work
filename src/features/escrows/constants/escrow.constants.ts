export const ESCROWS_PAGE_SIZE = 9;

export const ESCROWS_QUERY_KEY = ["escrows"] as const;

export function escrowsQueryKey(walletAddress: string | null) {
  return [...ESCROWS_QUERY_KEY, walletAddress ?? "anonymous"] as const;
}

export function escrowDetailQueryKey(
  contractId: string,
  walletAddress: string | null,
) {
  return ["escrow", contractId, walletAddress ?? "anonymous"] as const;
}
