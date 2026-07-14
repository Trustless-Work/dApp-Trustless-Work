import type { LucideIcon } from "lucide-react";
import { PenLineIcon, UsersIcon } from "lucide-react";
import {
  ESCROW_ROLE_ICONS,
  type EscrowRoleId,
} from "@/constants/escrow-roles.constants";
import type { EscrowRoleFilter } from "@/features/escrows/types/escrow.types";

export const ROLE_LABELS: Record<EscrowRoleFilter, string> = {
  approver: "Approver",
  serviceProvider: "Service Provider",
  platform: "Platform",
  releaseSigner: "Release Signer",
  disputeResolver: "Dispute Resolver",
  receiver: "Receiver",
  admin: "Admin",
  observer: "Observer",
  signer: "Signer",
};

const ROLE_FILTER_ICON_IDS: Record<EscrowRoleFilter, EscrowRoleId | null> = {
  approver: "approvers",
  serviceProvider: "service-providers",
  platform: "platform",
  releaseSigner: "release-signers",
  disputeResolver: "dispute-resolvers",
  receiver: "receiver",
  admin: "admin",
  observer: "observers",
  signer: null,
};

export function getEscrowRoleFilterIcon(
  role: EscrowRoleFilter,
): LucideIcon {
  const roleId = ROLE_FILTER_ICON_IDS[role];
  if (roleId) {
    return ESCROW_ROLE_ICONS[roleId];
  }

  return PenLineIcon;
}

export const ANY_ROLE_FILTER_ICON = UsersIcon;

export function capitalizeLabel(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
