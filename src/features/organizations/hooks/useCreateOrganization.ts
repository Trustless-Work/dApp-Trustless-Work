"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildMemberFromUser, mapUserToMemberInput } from "@/features/organizations/helpers/member-from-user.helper";
import { organizationService } from "@/features/organizations/services/organization.service";
import type {
  CreateOrganizationInput,
  OrganizationResponse,
} from "@/features/organizations/types/organization.types";
import {
  prependOrganizationToCache,
  setInitialMembersCache,
} from "@/features/organizations/utils/organizations-cache.helper";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";
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
      prependOrganizationToCache(queryClient, organization);

      if (user) {
        setInitialMembersCache(
          queryClient,
          organization.id,
          buildMemberFromUser(user, organization.id, walletAddress),
        );
      }

      playSound("accept");
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
