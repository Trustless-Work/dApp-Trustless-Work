"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ORGANIZATIONS_QUERY_KEY,
} from "@/features/organizations/hooks/useOrganizations";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { UpdateOrganizationInput } from "@/features/organizations/types/organization.types";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

type UpdateOrganizationVariables = {
  id: string;
  payload: UpdateOrganizationInput;
};

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateOrganizationVariables) =>
      organizationService.update(id, payload),
    onSuccess: (organization) => {
      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      playSound("accept");
      toast.success("Organization renamed", {
        description: `"${organization.name}" was updated successfully.`,
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
