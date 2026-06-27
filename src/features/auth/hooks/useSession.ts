"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";
import type { UserResponse } from "@/features/auth/types/auth.types";

export function useSession() {
  return useQuery<UserResponse | null>({
    queryKey: ["session", "me"],
    queryFn: async () => {
      const status = await authService.checkSession();
      if (!status.authenticated) {
        return null;
      }
      return authService.getMe();
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
