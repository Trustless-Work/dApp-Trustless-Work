"use client";

import { useQuery } from "@tanstack/react-query";
import { organizationService } from "@/features/organizations/services/organization.service";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";

export const ORGANIZATIONS_QUERY_KEY = ["organizations", "mine"] as const;

export function useOrganizations() {
  return useQuery<OrganizationResponse[]>({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: () => organizationService.listMine(),
  });
}

export function organizationMembersQueryKey(organizationId: string) {
  return ["organizations", organizationId, "members"] as const;
}
