"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "@/features/organizations/services/admin-user.service";
import type { UserResponse } from "@/types";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export function useAdminUsers(enabled = true) {
  return useQuery<UserResponse[]>({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: () => adminUserService.listAll(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
