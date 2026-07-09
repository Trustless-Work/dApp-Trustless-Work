import type { EscrowRoleId } from "@/constants/escrow-roles.constants";
import { ESCROW_ROLE_LABELS } from "@/constants/escrow-roles.constants";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredSingleReleaseEscrow } from "@/features/escrows/types/escrow.types";
import {
  getMilestoneApprovalsTarget,
  isMilestoneApproved,
  isMilestoneDisputed,
  isMilestoneReleased,
  type EscrowMilestone,
} from "@/features/escrows/utils/escrow-milestone.helper";

export type EscrowRoleEntry = {
  readonly id: EscrowRoleId;
  readonly label: string;
  readonly addresses: readonly string[];
};

export type MilestoneDisplayStatus =
  | "pending"
  | "approved"
  | "released"
  | "disputed";

export type EscrowBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type MilestoneCardDisplayStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "released"
  | "disputed";

export function getMilestoneStatusBadgeVariant(
  status: MilestoneDisplayStatus,
): EscrowBadgeVariant {
  switch (status) {
    case "pending":
      return "secondary";
    case "approved":
      return "outline";
    case "released":
      return "default";
    case "disputed":
      return "destructive";
  }
}

export function getEscrowStatusBadgeVariant(
  escrow: StoredEscrow,
): EscrowBadgeVariant {
  if (isEscrowDisputed(escrow)) {
    return "destructive";
  }

  if (isEscrowReleased(escrow)) {
    return "secondary";
  }

  return "default";
}

export function getEscrowCardStatusBadgeVariant(
  status: "active" | "released" | "disputed",
): EscrowBadgeVariant {
  switch (status) {
    case "active":
      return "default";
    case "released":
      return "secondary";
    case "disputed":
      return "destructive";
  }
}

export function getMilestoneCardStatusBadgeVariant(
  status: MilestoneCardDisplayStatus,
): EscrowBadgeVariant {
  switch (status) {
    case "pending":
      return "secondary";
    case "in_progress":
      return "outline";
    case "completed":
      return "default";
    case "released":
      return "secondary";
    case "disputed":
      return "destructive";
  }
}

export function getMilestoneCardStatusLabel(
  status: MilestoneCardDisplayStatus,
): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "released":
      return "Released";
    case "disputed":
      return "Disputed";
  }
}

export function getEscrowTypeLabel(type: StoredEscrow["type"]): string {
  return type === "single-release" ? "Single release" : "Multi release";
}

export function getEscrowStatusLabel(escrow: StoredEscrow): string {
  if (isEscrowDisputed(escrow)) {
    return "Disputed";
  }

  if (isEscrowReleased(escrow)) {
    return "Released";
  }

  return "Active";
}

export function getMilestoneDisplayStatus(
  milestone: EscrowMilestone,
): MilestoneDisplayStatus {
  if (isMilestoneDisputed(milestone)) {
    return "disputed";
  }

  if (isMilestoneReleased(milestone)) {
    return "released";
  }

  if (isMilestoneApproved(milestone)) {
    return "approved";
  }

  return "pending";
}

export function formatMilestoneApprovals(milestone: EscrowMilestone): string {
  const count = milestone.approvals?.approvalCount ?? 0;
  const target = getMilestoneApprovalsTarget(milestone) || 1;
  return `${count}/${target}`;
}

export function getEscrowRoleEntries(escrow: StoredEscrow): EscrowRoleEntry[] {
  const entries: EscrowRoleEntry[] = [
    {
      id: "approvers",
      label: ESCROW_ROLE_LABELS.approvers,
      addresses: escrow.roles.approvers,
    },
    {
      id: "service-providers",
      label: ESCROW_ROLE_LABELS["service-providers"],
      addresses: escrow.roles.serviceProviders,
    },
    {
      id: "platform",
      label: ESCROW_ROLE_LABELS.platform,
      addresses: [escrow.roles.platform],
    },
    {
      id: "release-signers",
      label: ESCROW_ROLE_LABELS["release-signers"],
      addresses: escrow.roles.releaseSigners,
    },
    {
      id: "dispute-resolvers",
      label: ESCROW_ROLE_LABELS["dispute-resolvers"],
      addresses: escrow.roles.disputeResolvers,
    },
    {
      id: "admin",
      label: ESCROW_ROLE_LABELS.admin,
      addresses: [escrow.roles.admin],
    },
  ];

  if (isStoredSingleReleaseEscrow(escrow)) {
    entries.push({
      id: "receiver",
      label: ESCROW_ROLE_LABELS.receiver,
      addresses: [escrow.roles.receiver],
    });
  }

  return entries;
}

export function getAddressOccurrenceCounts(
  roles: readonly { addresses: readonly string[] }[],
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const role of roles) {
    for (const address of role.addresses) {
      counts.set(address, (counts.get(address) ?? 0) + 1);
    }
  }

  return counts;
}

export function isSharedEscrowAddress(
  counts: ReadonlyMap<string, number>,
  address: string,
): boolean {
  return (counts.get(address) ?? 0) > 1;
}

export function getEscrowDisplayAmount(escrow: StoredEscrow): number {
  if (isStoredSingleReleaseEscrow(escrow)) {
    return escrow.amount;
  }

  return escrow.milestones.reduce(
    (total, milestone) => total + milestone.amount,
    0,
  );
}

export function getEscrowAssetSymbol(escrow: StoredEscrow): string {
  return escrow.trustline.symbol;
}

export function isEscrowReleased(escrow: StoredEscrow): boolean {
  if (isStoredSingleReleaseEscrow(escrow)) {
    return escrow.released === true;
  }

  return escrow.milestones.every((milestone) => milestone.released === true);
}

export function isEscrowDisputed(escrow: StoredEscrow): boolean {
  if (isStoredSingleReleaseEscrow(escrow)) {
    return escrow.dispute?.isDisputed === true;
  }

  return escrow.milestones.some(
    (milestone) => milestone.dispute?.isDisputed === true,
  );
}

export function matchesEscrowFilterStatus(
  escrow: StoredEscrow,
  status: "all" | "active" | "released" | "disputed",
): boolean {
  if (status === "all") {
    return true;
  }

  if (status === "released") {
    return isEscrowReleased(escrow);
  }

  if (status === "disputed") {
    return isEscrowDisputed(escrow);
  }

  return !isEscrowReleased(escrow) && !isEscrowDisputed(escrow);
}
