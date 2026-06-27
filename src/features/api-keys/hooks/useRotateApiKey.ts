"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_KEYS_QUERY_KEY } from "@/features/api-keys/hooks/useApiKeys";
import { apiKeyService } from "@/features/api-keys/services/api-key.service";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

type UseRotateApiKeyOptions = {
  onRotated?: (apiKey: string) => void;
};

export function useRotateApiKey(options?: UseRotateApiKeyOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeyService.rotateApiKey(keyId),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      playSound("accept");
      toast.success("API key rotated", {
        description: "Copy your new key now — it won't be shown again.",
      });
      options?.onRotated?.(result.apiKey);
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
