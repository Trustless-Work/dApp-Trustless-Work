"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_KEYS_QUERY_KEY } from "@/features/api-keys/hooks/useApiKeys";
import { apiKeyService } from "@/features/api-keys/services/api-key.service";
import { deactivateApiKeyInCache } from "@/features/api-keys/utils/api-keys-cache.helper";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeyService.revokeApiKey(keyId),
    onSuccess: (_result, keyId) => {
      deactivateApiKeyInCache(queryClient, keyId);
      void queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      playSound("delete");
      toast.success("API key revoked", {
        description: "The key can no longer authenticate requests.",
      });
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
