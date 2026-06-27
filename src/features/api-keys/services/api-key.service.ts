import type { GeneratedApiKeyResponse } from "@/features/auth/types/auth.types";
import type {
  ApiKeyResponse,
  CreateApiKeyInput,
} from "@/features/api-keys/types/api-key.types";
import http from "@/lib/http";

export class ApiKeyService {
  async listApiKeys(): Promise<ApiKeyResponse[]> {
    const { data } = await http.get<ApiKeyResponse[]>(
      "/core/users/me/api-keys",
    );
    return data;
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
      `/users/me/api-keys/${encodeURIComponent(keyId)}/rotate`,
    );
    return data;
  }

  async deleteApiKey(keyId: string): Promise<void> {
    await http.delete(`/users/me/api-keys/${encodeURIComponent(keyId)}`);
  }
}

export const apiKeyService = new ApiKeyService();
