import { EscrowActionPolicy } from "@/features/escrows/domain/escrow-action-policy";
import type { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
import type { StoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import {
  hasMilestonePassedThroughDispute,
  isMilestoneApproved,
  isMilestoneDisputed,
  isMilestoneDisputeResolved,
  isMilestoneReleased,
  isMilestoneTerminal,
} from "@/features/escrows/utils/escrow-milestone.helper";

export class MultiReleaseActionPolicy extends EscrowActionPolicy {
  constructor(
    private readonly multiEscrow: StoredMultiReleaseEscrow,
    roles: EscrowRoleContext,
  ) {
    super(multiEscrow, roles);
  }

  canUpdate(): boolean {
    if (!this.roles.isAdmin() || !this.isUnfunded()) {
      return false;
    }

    return !this.hasAnyDisputedMilestone();
  }

  canManageMilestones(): boolean {
    if (!this.roles.isAdmin()) {
      return false;
    }

    if (this.hasAnyDisputedMilestone()) {
      return false;
    }

    if (this.hasAnyResolvedDispute()) {
      return false;
    }

    if (this.areAllMilestonesReleased()) {
      return false;
    }

    return true;
  }

  canWithdrawRemainingFunds(): boolean {
    if (!this.roles.isDisputeResolver() || !this.hasPositiveBalance()) {
      return false;
    }

    if (this.multiEscrow.milestones.length === 0) {
      return false;
    }

    const anyPassedThroughDispute = this.multiEscrow.milestones.some(
      (milestone) => hasMilestonePassedThroughDispute(milestone),
    );

    if (!anyPassedThroughDispute) {
      return false;
    }

    return this.multiEscrow.milestones.every((milestone) =>
      isMilestoneTerminal(milestone),
    );
  }

  canReleaseEscrow(): boolean {
    return false;
  }

  canDisputeEscrow(): boolean {
    return false;
  }

  canResolveEscrowDispute(): boolean {
    return false;
  }

  canReleaseMilestone(milestoneIndex: number): boolean {
    if (!this.roles.isReleaseSigner()) {
      return false;
    }

    const milestone = this.getMilestone(milestoneIndex);
    if (!milestone) {
      return false;
    }

    if (
      isMilestoneDisputed(milestone) ||
      isMilestoneDisputeResolved(milestone) ||
      isMilestoneReleased(milestone)
    ) {
      return false;
    }

    return isMilestoneApproved(milestone);
  }

  canApproveAndReleaseMilestone(milestoneIndex: number): boolean {
    if (!this.roles.isApprover() || !this.roles.isReleaseSigner()) {
      return false;
    }

    const milestone = this.multiEscrow.milestones[milestoneIndex];
    if (!milestone) {
      return false;
    }

    if (
      isMilestoneDisputed(milestone) ||
      isMilestoneDisputeResolved(milestone) ||
      isMilestoneReleased(milestone)
    ) {
      return false;
    }

    if (!this.hasSufficientBalanceForMilestone(milestone)) {
      return false;
    }

    const alreadyApproved = isMilestoneApproved(milestone);
    const canApproveNow = this.canApproveMilestone(milestoneIndex);

    if (!alreadyApproved && !canApproveNow) {
      return false;
    }

    return true;
  }

  canDisputeMilestone(milestoneIndex: number): boolean {
    if (!this.roles.canOpenDispute(milestoneIndex)) {
      return false;
    }

    const milestone = this.getMilestone(milestoneIndex);
    if (!milestone) {
      return false;
    }

    return (
      !isMilestoneReleased(milestone) &&
      !isMilestoneDisputed(milestone) &&
      !isMilestoneDisputeResolved(milestone)
    );
  }

  canResolveMilestoneDispute(milestoneIndex: number): boolean {
    if (!this.roles.isDisputeResolver()) {
      return false;
    }

    const milestone = this.getMilestone(milestoneIndex);
    if (!milestone) {
      return false;
    }

    return isMilestoneDisputed(milestone);
  }

  private hasAnyDisputedMilestone(): boolean {
    return this.multiEscrow.milestones.some((milestone) =>
      isMilestoneDisputed(milestone),
    );
  }

  private hasAnyResolvedDispute(): boolean {
    return this.multiEscrow.milestones.some((milestone) =>
      isMilestoneDisputeResolved(milestone),
    );
  }

  private areAllMilestonesReleased(): boolean {
    if (this.multiEscrow.milestones.length === 0) {
      return false;
    }

    return this.multiEscrow.milestones.every((milestone) =>
      isMilestoneReleased(milestone),
    );
  }

  private hasSufficientBalanceForMilestone(
    milestone: MultiReleaseMilestone,
  ): boolean {
    return this.multiEscrow.balance >= milestone.amount;
  }
}
