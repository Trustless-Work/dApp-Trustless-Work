"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { organizationService } from "@/features/organizations/services/organization.service";
import { flattenKeysetPages } from "@/lib/pagination";
import { DEFAULT_KEYSET_LIMIT } from "@/types/pagination.entity";

export const ORGANIZATIONS_QUERY_KEY = ["organizations", "mine"] as const;

export function organizationMembersQueryKey(organizationId: string) {
  return ["organizations", organizationId, "members"] as const;
}

export function useOrganizations() {
  const query = useInfiniteQuery({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      organizationService.listMinePage({
        limit: DEFAULT_KEYSET_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const organizations = useMemo(
    () => flattenKeysetPages(query.data),
    [query.data],
  );

  return {
    ...query,
    organizations,
  };
}
