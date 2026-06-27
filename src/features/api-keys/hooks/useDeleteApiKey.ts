"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_KEYS_QUERY_KEY } from "@/features/api-keys/hooks/useApiKeys";
import { apiKeyService } from "@/features/api-keys/services/api-key.service";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeyService.deleteApiKey(keyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      playSound("delete");
      toast.success("API key deleted", {
        description: "The key can no longer authenticate requests.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
