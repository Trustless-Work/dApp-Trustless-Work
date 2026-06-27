"use client";

import { useQuery } from "@tanstack/react-query";
import { apiKeyService } from "@/features/api-keys/services/api-key.service";

export const API_KEYS_QUERY_KEY = ["user", "api-keys"] as const;

export function useApiKeys() {
  const query = useQuery({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: () => apiKeyService.listApiKeys(),
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    apiKeys: query.data ?? [],
  };
}
