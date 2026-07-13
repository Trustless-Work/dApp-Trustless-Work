import type { IsoDateTimeString } from "@/types/primitives";

export const ACCOUNT_ROLES = [
  "ADMIN",
  "BACKOFFICE_ADMIN",
  "ESCROW_MANAGER",
] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export function isAccountRole(value: string): value is AccountRole {
  return (ACCOUNT_ROLES as readonly string[]).includes(value);
}

export interface WithAccountRoles {
  roles: readonly AccountRole[];
}

export interface WithEntityTimestamps {
  createdAt?: IsoDateTimeString;
  updatedAt?: IsoDateTimeString;
}
