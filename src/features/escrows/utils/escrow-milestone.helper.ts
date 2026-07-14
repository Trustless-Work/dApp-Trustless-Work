import type { StoredEscrow } from "@/features/escrows/types/escrow.types";

export type EscrowMilestone = StoredEscrow["milestones"][number];

export function getMilestoneApprovalsTarget(milestone: EscrowMilestone): number {
  return milestone.approvals?.target ?? milestone.approvalsTarget ?? 0;
}

export function getMilestoneApprovalCount(milestone: EscrowMilestone): number {
  return milestone.approvals?.approvalCount ?? 0;
}

export function getMilestoneApprovedBy(
  milestone: EscrowMilestone,
): readonly string[] {
  return milestone.approvals?.approvedBy ?? [];
}

export function isMilestoneApproved(milestone: EscrowMilestone): boolean {
  const target = getMilestoneApprovalsTarget(milestone);
  return target > 0 && getMilestoneApprovalCount(milestone) >= target;
}

export function isMilestoneReleased(milestone: EscrowMilestone): boolean {
  return "released" in milestone && milestone.released === true;
}

export function isMilestoneDisputed(milestone: EscrowMilestone): boolean {
  return "dispute" in milestone && milestone.dispute?.isDisputed === true;
}

export function isMilestoneDisputeResolved(milestone: EscrowMilestone): boolean {
  return "dispute" in milestone && milestone.dispute?.resolved === true;
}

/**
 * Free-form milestone status string — independent of approvals and flags.
 */
export function getMilestoneStatusText(milestone: EscrowMilestone): string {
  const status = milestone.status?.trim();
  return status && status.length > 0 ? status : "";
}

export const MILESTONE_FLAGS = [
  "approved",
  "disputed",
  "resolved",
  "released",
] as const;

export type MilestoneFlag = (typeof MILESTONE_FLAGS)[number];

/**
 * Independent lifecycle flags. Multi-release can show several at once;
 * never replace or hide `status` / `evidence`.
 */
export function getMilestoneFlags(
  milestone: EscrowMilestone,
): readonly MilestoneFlag[] {
  const flags: MilestoneFlag[] = [];

  if (isMilestoneApproved(milestone)) {
    flags.push("approved");
  }

  if (isMilestoneDisputed(milestone)) {
    flags.push("disputed");
  }

  if (isMilestoneDisputeResolved(milestone)) {
    flags.push("resolved");
  }

  if (isMilestoneReleased(milestone)) {
    flags.push("released");
  }

  return flags;
}

export function getMilestoneEvidence(milestone: EscrowMilestone): string {
  const evidence = milestone.evidence?.trim();
  return evidence && evidence.length > 0 ? evidence : "";
}

/**
 * Dispute explanation stored on the milestone (`dispute.reason`).
 * Multi-release only; independent from `milestone.evidence`.
 */
export function getMilestoneDisputeReason(milestone: EscrowMilestone): string {
  if (!("dispute" in milestone) || !milestone.dispute) {
    return "";
  }

  const reason = milestone.dispute.reason?.trim();
  return reason && reason.length > 0 ? reason : "";
}

/**
 * Multi-release only: milestone has an active or resolved dispute to surface.
 */
export function hasMilestoneDisputeState(milestone: EscrowMilestone): boolean {
  return isMilestoneDisputed(milestone) || isMilestoneDisputeResolved(milestone);
}

export function hasMilestoneDetailAttachments(
  milestone: EscrowMilestone,
  options?: { includeDispute?: boolean },
): boolean {
  if (getMilestoneEvidence(milestone).length > 0) {
    return true;
  }

  if (!options?.includeDispute || !hasMilestoneDisputeState(milestone)) {
    return false;
  }

  return getMilestoneDisputeReason(milestone).length > 0;
}

/**
 * Escrow-level dispute (single-release). Multi-release disputes live on milestones.
 */
export function getEscrowDisputeReason(escrow: StoredEscrow): string {
  if (!("dispute" in escrow) || !escrow.dispute) {
    return "";
  }

  const reason = escrow.dispute.reason?.trim();
  return reason && reason.length > 0 ? reason : "";
}

/** True only when single-release escrow has an actual dispute (open or resolved). */
export function hasEscrowDispute(escrow: StoredEscrow): boolean {
  if (!("dispute" in escrow) || !escrow.dispute) {
    return false;
  }

  return (
    escrow.dispute.isDisputed === true || escrow.dispute.resolved === true
  );
}

export function hasMilestonePassedThroughDispute(
  milestone: EscrowMilestone,
): boolean {
  return isMilestoneDisputed(milestone) || isMilestoneDisputeResolved(milestone);
}

export function isMilestoneTerminal(milestone: EscrowMilestone): boolean {
  return isMilestoneReleased(milestone) || isMilestoneDisputeResolved(milestone);
}

export function hasApproverAlreadyApproved(
  milestone: EscrowMilestone,
  walletAddress: string,
): boolean {
  const trimmed = walletAddress.trim();
  if (!trimmed) {
    return false;
  }

  return getMilestoneApprovedBy(milestone).some(
    (address) => address.trim() === trimmed,
  );
}
