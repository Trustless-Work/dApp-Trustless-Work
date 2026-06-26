"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/features/organizations/services/organization.service";
import {
  isMemberLinkedToUser,
  mapUserToMemberInput,
  withCurrentUserMember,
} from "@/features/organizations/helpers/member-from-user.helper";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/useOrganizations";
import { useAuth } from "@/providers/AuthProvider";
import { useWalletContext } from "@/providers/WalletProvider";

export function useOrganizationMembers(organizationId: string | null) {
  return useQuery<MemberResponse[]>({
    queryKey: organizationId
      ? organizationMembersQueryKey(organizationId)
      : ["organizations", "members", "none"],
    queryFn: () => {
      if (!organizationId) {
        return Promise.resolve([]);
      }
      return organizationService.listMembers(organizationId);
    },
    enabled: Boolean(organizationId),
  });
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

    const apiMembers = query.data ?? [];
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
      .upsertMember(
        organizationId,
        mapUserToMemberInput(user, walletAddress),
      )
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
    query.data,
    query.isFetching,
    query.isSuccess,
    queryClient,
    user,
    walletAddress,
  ]);

  const members = useMemo(
    () =>
      organizationId
        ? withCurrentUserMember(
            query.data ?? [],
            user,
            organizationId,
            walletAddress,
          )
        : [],
    [organizationId, query.data, user, walletAddress],
  );

  return {
    ...query,
    members,
  };
}
