"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationService } from "@/features/organizations/services/organization.service";
import type {
  CreateOrganizationInput,
  OrganizationResponse,
} from "@/features/organizations/types/organization.types";
import { ORGANIZATIONS_QUERY_KEY } from "@/features/organizations/hooks/useOrganizations";
import { parseApiError } from "@/lib/api-error";

type UseCreateOrganizationOptions = {
  onCreated?: (organization: OrganizationResponse) => void;
};

export function useCreateOrganization(options?: UseCreateOrganizationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationInput) =>
      organizationService.create(payload),
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
      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
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
