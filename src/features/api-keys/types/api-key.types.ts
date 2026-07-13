import type {
  EntityId,
  IsoDateTimeString,
  WithAccountRoles,
  WithEntityTimestamps,
} from "@/types";

export type { EntityId, IsoDateTimeString };

export interface ApiKeyResponse extends WithAccountRoles, WithEntityTimestamps {
  id: EntityId;
  userId: EntityId;
  description?: string | null;
  active: boolean;
  expiresAt?: IsoDateTimeString | null;
  lastUsedAt?: IsoDateTimeString | null;
  lastUsedIp?: string | null;
}

export interface CreateApiKeyInput {
  description?: string;
  platformId?: string;
}

export function isApiKeyRevoked(apiKey: ApiKeyResponse): boolean {
  return apiKey.active === false;
}

export function isApiKeyExpired(apiKey: ApiKeyResponse): boolean {
  if (!apiKey.expiresAt) {
    return false;
  }

  const expiresAt = new Date(apiKey.expiresAt);
  return (
    !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()
  );
}

export function isApiKeyActive(apiKey: ApiKeyResponse): boolean {
  return apiKey.active !== false && !isApiKeyExpired(apiKey);
}
