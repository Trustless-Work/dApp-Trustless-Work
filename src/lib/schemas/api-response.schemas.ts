import { z } from "zod/v3";
import { ACCOUNT_ROLES, isAccountRole } from "@/types/roles";
import type { AccountRole } from "@/types/roles";

export const accountRoleSchema = z.enum(ACCOUNT_ROLES);

function parseAccountRoles(roles: string[]): AccountRole[] {
  return roles.filter(isAccountRole);
}

export const userResponseSchema = z.object({
  id: z.string().min(1),
  email: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
  emailVerified: z.boolean().optional(),
  roles: z.array(z.string()).transform(parseAccountRoles),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const organizationResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const memberResponseSchema = z.object({
  id: z.string().min(1),
  platformId: z.string().min(1),
  externalId: z.string().nullable().optional(),
  walletAddress: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const apiKeyResponseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  description: z.string().nullable().optional(),
  active: z.boolean(),
  expiresAt: z.string().nullable().optional(),
  lastUsedAt: z.string().nullable().optional(),
  lastUsedIp: z.string().nullable().optional(),
  roles: z.array(z.string()).transform(parseAccountRoles),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const userWalletResponseSchema = z.object({
  address: z.string().min(1),
  verified: z.boolean(),
  linkedAt: z.string().optional(),
});
