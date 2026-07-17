import type { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import {
  hasApproverAlreadyApproved,
  isMilestoneApproved,
  isMilestoneDisputed,
  isMilestoneReleased,
} from "@/features/escrows/utils/escrow-milestone.helper";

export abstract class EscrowActionPolicy {
  protected constructor(
    protected readonly escrow: StoredEscrow,
    protected readonly roles: EscrowRoleContext,
  ) {}

  canFund(): boolean {
    return this.roles.isConnected;
  }

  abstract canUpdate(): boolean;

  abstract canManageMilestones(): boolean;

  canEditExistingMilestones(): boolean {
    return this.escrow.balance <= 0;
  }

  abstract canWithdrawRemainingFunds(): boolean;

  canChangeMilestoneStatus(milestoneIndex: number): boolean {
    if (!this.roles.isServiceProvider()) {
      return false;
    }

    return this.getMilestone(milestoneIndex) !== null;
  }

  canApproveMilestone(milestoneIndex: number): boolean {
    if (!this.roles.isApprover() || !this.roles.address) {
      return false;
    }

    const milestone = this.getMilestone(milestoneIndex);
    if (!milestone) {
      return false;
    }

    if (isMilestoneReleased(milestone) || isMilestoneDisputed(milestone)) {
      return false;
    }

    if (isMilestoneApproved(milestone)) {
      return false;
    }

    return !hasApproverAlreadyApproved(milestone, this.roles.address);
  }

  abstract canReleaseEscrow(): boolean;

  abstract canDisputeEscrow(): boolean;

  abstract canResolveEscrowDispute(): boolean;

  abstract canReleaseMilestone(milestoneIndex: number): boolean;

  abstract canApproveAndReleaseMilestone(milestoneIndex: number): boolean;

  abstract canDisputeMilestone(milestoneIndex: number): boolean;

  abstract canResolveMilestoneDispute(milestoneIndex: number): boolean;

  /**
   * Whether the connected wallet can manage the CCTP cross-chain payout
   * preference for this escrow (single-release, omit `milestoneIndex`) or
   * milestone (multi-release, pass `milestoneIndex`). Receiver-only, by
   * design — never the release signer, admin, or anyone else (see
   * CONTRACT_ROLES_REFERENCE.md in the contracts repo: the release signer
   * only decides *when* to release, never *how* the receiver gets paid).
   * Same for both escrow kinds, so it lives here instead of being abstract.
   */
  canManagePayoutPreference(milestoneIndex?: number): boolean {
    if (milestoneIndex === undefined) {
      return this.roles.isEscrowReceiver();
    }

    return this.roles.isMilestoneReceiver(milestoneIndex);
  }

  protected getMilestone(milestoneIndex: number) {
    return this.escrow.milestones[milestoneIndex] ?? null;
  }

  protected hasPositiveBalance(): boolean {
    return this.escrow.balance > 0;
  }

  protected isUnfunded(): boolean {
    return this.escrow.balance <= 0;
  }
}
