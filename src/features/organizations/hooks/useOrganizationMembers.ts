"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  isMemberLinkedToUser,
  mapUserToMemberInput,
  withCurrentUserMember,
} from "@/features/organizations/helpers/member-from-user.helper";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import { flattenKeysetPages } from "@/lib/pagination";
import { DEFAULT_KEYSET_LIMIT } from "@/types/pagination.entity";
import { useAuth } from "@/providers/AuthProvider";
import { useWalletContext } from "@/providers/WalletProvider";

export const ORGANIZATIONS_QUERY_KEY = ["organizations", "mine"] as const;

export function useOrganizations() {
  return useQuery<OrganizationResponse[]>({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: () => organizationService.listMine(),
  });
}

export function organizationMembersQueryKey(organizationId: string) {
  return ["organizations", organizationId, "members"] as const;
}

export function useOrganizationMembers(organizationId: string | null) {
  const query = useInfiniteQuery({
    queryKey: organizationId
      ? organizationMembersQueryKey(organizationId)
      : ["organizations", "members", "none"],
    queryFn: ({ pageParam }) => {
      if (!organizationId) {
        return Promise.resolve({
          data: [],
          hasMore: false,
          nextCursor: null,
        });
      }

      return organizationService.listMembersPage(organizationId, {
        limit: DEFAULT_KEYSET_LIMIT,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(organizationId),
  });

  const members = useMemo(() => flattenKeysetPages(query.data), [query.data]);

  return {
    ...query,
    members,
  };
}

export function useOrganizationMembersDisplay(organizationId: string | null) {
  const queryClient = useQueryClient();
  const query = useOrganizationMembers(organizationId);
  const { user } = useAuth();
  const { walletAddress } = useWalletContext();
  const ensuredOrganizationRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !organizationId ||
      !user ||
      !query.isSuccess ||
      query.isFetching ||
      ensuredOrganizationRef.current === organizationId
    ) {
      return;
    }

    const apiMembers = query.members;
    if (
      apiMembers.some((member) =>
        isMemberLinkedToUser(member, user, walletAddress),
      )
    ) {
      ensuredOrganizationRef.current = organizationId;
      return;
    }

    ensuredOrganizationRef.current = organizationId;

    void organizationService
      .upsertMember(organizationId, mapUserToMemberInput(user, walletAddress))
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: organizationMembersQueryKey(organizationId),
        }),
      )
      .catch(() => {
        ensuredOrganizationRef.current = null;
      });
  }, [
    organizationId,
    query.isFetching,
    query.isSuccess,
    query.members,
    queryClient,
    user,
    walletAddress,
  ]);

  const members = useMemo(
    () =>
      organizationId
        ? withCurrentUserMember(
            query.members,
            user,
            organizationId,
            walletAddress,
          )
        : [],
    [organizationId, query.members, user, walletAddress],
  );

  return {
    ...query,
    members,
  };
}
