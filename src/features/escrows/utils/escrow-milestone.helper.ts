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
