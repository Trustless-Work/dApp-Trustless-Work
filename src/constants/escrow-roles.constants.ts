import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  Building2Icon,
  EyeIcon,
  ScaleIcon,
  ShieldIcon,
  UnlockIcon,
  WalletIcon,
  WrenchIcon,
} from "lucide-react";

export const ESCROW_ROLE_IDS = [
  "approvers",
  "service-providers",
  "release-signers",
  "dispute-resolvers",
  "admin",
  "platform",
  "receiver",
  "observers",
] as const;

export type EscrowRoleId = (typeof ESCROW_ROLE_IDS)[number];

export const ESCROW_ROLE_ICONS: Record<EscrowRoleId, LucideIcon> = {
  approvers: BadgeCheckIcon,
  "service-providers": WrenchIcon,
  "release-signers": UnlockIcon,
  "dispute-resolvers": ScaleIcon,
  admin: ShieldIcon,
  platform: Building2Icon,
  receiver: WalletIcon,
  observers: EyeIcon,
};

export const ESCROW_ROLE_LABELS: Record<EscrowRoleId, string> = {
  approvers: "Approvers",
  "service-providers": "Service providers",
  "release-signers": "Release signers",
  "dispute-resolvers": "Dispute resolvers",
  admin: "Admin",
  platform: "Platform",
  receiver: "Receiver",
  observers: "Observers",
};

export const TRUSTLESS_WORK_DOCS_URL = "https://docs.trustlesswork.com";

export const ESCROW_ROLE_HELP_PATH = "/dashboard/help";

export function getEscrowRoleHelpHref(roleId: EscrowRoleId): string {
  return `${ESCROW_ROLE_HELP_PATH}#${roleId}`;
}

export function isEscrowRoleId(value: string): value is EscrowRoleId {
  return (ESCROW_ROLE_IDS as readonly string[]).includes(value);
}
