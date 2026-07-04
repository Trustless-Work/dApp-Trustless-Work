"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/useOrganizations";
import { organizationService } from "@/features/organizations/services/organization.service";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

type ArchiveMemberVariables = {
  organizationId: string;
  memberId: string;
};

export function useArchiveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, memberId }: ArchiveMemberVariables) =>
      organizationService.archiveMember(organizationId, memberId),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(variables.organizationId),
      });
      playSound("delete");
      toast.success("Member removed", {
        description: "They will no longer appear in this organization.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
