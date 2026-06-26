"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  buildMemberFromUser,
  mapUserToMemberInput,
} from "@/features/organizations/helpers/member-from-user.helper";
import { organizationService } from "@/features/organizations/services/organization.service";
import type {
  CreateOrganizationInput,
  MemberResponse,
  OrganizationResponse,
} from "@/features/organizations/types/organization.types";
import {
  ORGANIZATIONS_QUERY_KEY,
  organizationMembersQueryKey,
} from "@/features/organizations/hooks/useOrganizations";
import { parseApiError } from "@/lib/api-error";
import { useAuth } from "@/providers/AuthProvider";
import { useWalletContext } from "@/providers/WalletProvider";

type UseCreateOrganizationOptions = {
  onCreated?: (organization: OrganizationResponse) => void;
};

export function useCreateOrganization(options?: UseCreateOrganizationOptions) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { walletAddress } = useWalletContext();

  return useMutation({
    mutationFn: async (payload: CreateOrganizationInput) => {
      const organization = await organizationService.create(payload);

      if (user) {
        await organizationService.upsertMember(
          organization.id,
          mapUserToMemberInput(user, walletAddress),
        );
      }

      return organization;
    },
    onSuccess: (organization) => {
      queryClient.setQueryData<OrganizationResponse[]>(
        ORGANIZATIONS_QUERY_KEY,
        (previous) => {
          if (!previous) {
            return [organization];
          }

          const alreadyListed = previous.some((org) => org.id === organization.id);
          if (alreadyListed) {
            return previous;
          }

          return [...previous, organization];
        },
      );

      if (user) {
        queryClient.setQueryData<MemberResponse[]>(
          organizationMembersQueryKey(organization.id),
          [buildMemberFromUser(user, organization.id, walletAddress)],
        );
      }

      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(organization.id),
      });
      toast.success("Organization created", {
        description: `"${organization.name}" is ready to use.`,
      });
      options?.onCreated?.(organization);
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
