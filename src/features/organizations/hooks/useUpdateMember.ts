"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/useOrganizations";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { UpdateMemberInput } from "@/features/organizations/types/organization.types";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

type UpdateMemberVariables = {
  organizationId: string;
  memberId: string;
  payload: UpdateMemberInput;
};

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, memberId, payload }: UpdateMemberVariables) =>
      organizationService.updateMember(organizationId, memberId, payload),
    onSuccess: (_member, variables) => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(variables.organizationId),
      });
      playSound("accept");
      toast.success("Member updated", {
        description: "Member details were saved successfully.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
