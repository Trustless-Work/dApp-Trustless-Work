"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ORGANIZATIONS_QUERY_KEY,
} from "@/features/organizations/hooks/useOrganizations";
import { organizationService } from "@/features/organizations/services/organization.service";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";
import { useActiveOrganization } from "@/providers/OrganizationProvider";

export function useArchiveOrganization() {
  const queryClient = useQueryClient();
  const { activeOrganizationId, setActiveOrganization, organizations } =
    useActiveOrganization();

  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.archive(organizationId),
    onSuccess: (_result, organizationId) => {
      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });

      if (activeOrganizationId === organizationId) {
        const nextOrganization = organizations.find(
          (organization) => organization.id !== organizationId,
        );
        if (nextOrganization) {
          setActiveOrganization(nextOrganization.id);
        }
      }

      playSound("delete");
      toast.success("Organization archived", {
        description: "It will no longer appear in your organization list.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
