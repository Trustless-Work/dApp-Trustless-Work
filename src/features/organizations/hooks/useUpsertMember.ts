"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { UpsertMemberInput } from "@/features/organizations/types/organization.types";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/useOrganizations";
import { parseApiError } from "@/lib/api-error";

type UpsertMemberVariables = {
  organizationId: string;
  payload: UpsertMemberInput;
};

export function useUpsertMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, payload }: UpsertMemberVariables) =>
      organizationService.upsertMember(organizationId, payload),
    onSuccess: (_member, variables) => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(variables.organizationId),
      });
      toast.success("Member saved", {
        description: "The member record was updated successfully.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
