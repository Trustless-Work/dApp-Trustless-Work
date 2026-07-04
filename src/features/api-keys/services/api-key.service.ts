import type { GeneratedApiKeyResponse } from "@/features/auth/types/auth.types";
import type {
  ApiKeyResponse,
  CreateApiKeyInput,
} from "@/features/api-keys/types/api-key.types";
import http from "@/lib/http";
import {
  buildKeysetQuery,
  fetchAllKeysetPages,
  parseKeysetPage,
} from "@/lib/pagination";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";

export class ApiKeyService {
  async listApiKeysPage(
    params: KeysetListParams = {},
  ): Promise<KeysetPage<ApiKeyResponse>> {
    const { data } = await http.get<unknown>(
      `/core/users/me/api-keys${buildKeysetQuery(params)}`,
    );
    return parseKeysetPage<ApiKeyResponse>(data);
  }

  async listApiKeys(): Promise<ApiKeyResponse[]> {
    return fetchAllKeysetPages((params) => this.listApiKeysPage(params));
  }

  async createApiKey(
    payload: CreateApiKeyInput,
  ): Promise<GeneratedApiKeyResponse> {
    const { data } = await http.post<GeneratedApiKeyResponse>(
      "/core/users/me/api-keys",
      payload,
    );
    return data;
  }

  async rotateApiKey(keyId: string): Promise<GeneratedApiKeyResponse> {
    const { data } = await http.post<GeneratedApiKeyResponse>(
      `/core/users/me/api-keys/${encodeURIComponent(keyId)}/rotate`,
    );
    return data;
  }

  async revokeApiKey(keyId: string): Promise<void> {
    await http.put(
      `/core/users/me/api-keys/${encodeURIComponent(keyId)}/revoke`,
    );
  }
}

export const apiKeyService = new ApiKeyService();
