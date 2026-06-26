"use client";

import { useQuery } from "@tanstack/react-query";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/useOrganizations";

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
