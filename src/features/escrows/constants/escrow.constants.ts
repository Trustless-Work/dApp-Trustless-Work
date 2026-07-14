import type { EscrowListFilters } from "@/features/escrows/types/escrow.types";

export const ESCROWS_LIST_QUERY_ROOT = ["escrows", "list"] as const;

export const ESCROW_DETAIL_QUERY_ROOT = ["escrow", "detail"] as const;

export function stableSerializeFilters(
  filters: EscrowListFilters,
): Record<string, string | string[] | undefined> {
  return {
    type: filters.type,
    scope: filters.scope,
    status: filters.status,
    engagementId: filters.engagementId.trim() || undefined,
    contractIds:
      filters.contractIds.length > 0 ? [...filters.contractIds].sort() : undefined,
    participant: filters.participant.trim() || undefined,
    role: filters.role,
    platformId: filters.platformId.trim() || undefined,
    subjectId: filters.subjectId.trim() || undefined,
    createdAfter: filters.createdAfter.trim() || undefined,
    createdBefore: filters.createdBefore.trim() || undefined,
    sort: filters.sort,
    order: filters.order,
  };
}

export function escrowsListQueryKey(filters: EscrowListFilters) {
  return [...ESCROWS_LIST_QUERY_ROOT, stableSerializeFilters(filters)] as const;
}

export function escrowDetailQueryKey(contractId: string) {
  return [...ESCROW_DETAIL_QUERY_ROOT, contractId] as const;
}

/** @deprecated Prefer escrowsListQueryKey(filters) */
export const ESCROWS_QUERY_KEY = ESCROWS_LIST_QUERY_ROOT;

/** @deprecated Prefer escrowsListQueryKey */
export function escrowsQueryKey(_walletAddress: string | null) {
  return ESCROWS_LIST_QUERY_ROOT;
}

export const ESCROWS_PAGE_SIZE = 20;
