"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      await queryClient.cancelQueries({ queryKey: ["session"] });
      queryClient.setQueryData(["session", "me"], null);
    },
  });
}
