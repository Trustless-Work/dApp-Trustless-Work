import { EscrowActionPolicy } from "@/features/escrows/domain/escrow-action-policy";
import type { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
import type { StoredSingleReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { isMilestoneApproved } from "@/features/escrows/utils/escrow-milestone.helper";

export class SingleReleaseActionPolicy extends EscrowActionPolicy {
  constructor(
    private readonly singleEscrow: StoredSingleReleaseEscrow,
    roles: EscrowRoleContext,
  ) {
    super(singleEscrow, roles);
  }

  canUpdate(): boolean {
    if (!this.roles.isAdmin() || !this.isUnfunded()) {
      return false;
    }

    return !this.isDisputed();
  }

  canManageMilestones(): boolean {
    if (!this.roles.isAdmin()) {
      return false;
    }

    return (
      !this.isDisputed() &&
      !this.isReleased() &&
      !this.isDisputeResolved()
    );
  }

  canWithdrawRemainingFunds(): boolean {
    if (!this.roles.isDisputeResolver() || !this.hasPositiveBalance()) {
      return false;
    }

    const passedThroughDispute = this.isDisputed() || this.isDisputeResolved();
    const isTerminal = this.isReleased() || this.isDisputeResolved();

    return passedThroughDispute && isTerminal;
  }

  canReleaseEscrow(): boolean {
    if (!this.roles.isReleaseSigner()) {
      return false;
    }

    if (
      this.isReleased() ||
      this.isDisputeResolved() ||
      this.isDisputed()
    ) {
      return false;
    }

    if (this.singleEscrow.milestones.length === 0) {
      return false;
    }

    return this.singleEscrow.milestones.every((milestone) =>
      isMilestoneApproved(milestone),
    );
  }

  canDisputeEscrow(): boolean {
    if (!this.roles.canOpenDispute()) {
      return false;
    }

    return !this.isDisputed() && !this.isDisputeResolved();
  }

  canResolveEscrowDispute(): boolean {
    if (!this.roles.isDisputeResolver()) {
      return false;
    }

    return this.isDisputed();
  }

  canReleaseMilestone(_milestoneIndex: number): boolean {
    return false;
  }

  canApproveAndReleaseMilestone(_milestoneIndex: number): boolean {
    return false;
  }

  canDisputeMilestone(_milestoneIndex: number): boolean {
    return false;
  }

  canResolveMilestoneDispute(_milestoneIndex: number): boolean {
    return false;
  }

  private isDisputed(): boolean {
    return this.singleEscrow.dispute?.isDisputed === true;
  }

  private isDisputeResolved(): boolean {
    return this.singleEscrow.dispute?.resolved === true;
  }

  private isReleased(): boolean {
    return this.singleEscrow.released === true;
  }
}
