"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_KEYS_QUERY_KEY } from "@/features/api-keys/hooks/useApiKeys";
import { apiKeyService } from "@/features/api-keys/services/api-key.service";
import type { CreateApiKeyInput } from "@/features/api-keys/types/api-key.types";
import { parseApiError } from "@/lib/api-error";
import { playSound } from "@/lib/sounds";

type UseCreateApiKeyOptions = {
  onCreated?: (apiKey: string) => void;
};

export function useCreateApiKey(options?: UseCreateApiKeyOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyInput) =>
      apiKeyService.createApiKey(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      playSound("accept");
      toast.success("API key created", {
        description: "Copy your key now — it won't be shown again.",
      });
      options?.onCreated?.(result.apiKey);
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}
