import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { API_KEYS_QUERY_KEY } from "@/features/api-keys/hooks/useApiKeys";
import type { ApiKeyResponse } from "@/features/api-keys/types/api-key.types";
import type { KeysetPage } from "@/types/pagination.entity";

type ApiKeysCache = InfiniteData<KeysetPage<ApiKeyResponse>>;

export function deactivateApiKeyInCache(
  queryClient: QueryClient,
  keyId: string,
): void {
  queryClient.setQueriesData<ApiKeysCache>(
    { queryKey: API_KEYS_QUERY_KEY },
    (current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map((apiKey) =>
            apiKey.id === keyId ? { ...apiKey, active: false } : apiKey,
          ),
        })),
      };
    },
  );
}
