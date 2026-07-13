import type {
  EntityId,
  IsoDateTimeString,
  StellarAddress,
  WithEntityTimestamps,
} from "@/types";

export type { EntityId, IsoDateTimeString, StellarAddress };

export interface OrganizationResponse extends WithEntityTimestamps {
  id: EntityId;
  name: string;
}

export interface MemberResponse extends WithEntityTimestamps {
  id: EntityId;
  platformId: EntityId;
  externalId?: string | null;
  walletAddress?: StellarAddress | null;
  label?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface CreateOrganizationInput {
  name: string;
}

export interface UpdateOrganizationInput {
  name: string;
}

export interface UpsertMemberInput {
  externalId?: string;
  walletAddress?: StellarAddress;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMemberInput {
  externalId?: string;
  walletAddress?: StellarAddress;
  label?: string;
  metadata?: Record<string, unknown>;
}
