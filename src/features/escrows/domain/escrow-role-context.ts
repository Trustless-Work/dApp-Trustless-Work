import type { EscrowRoleId } from "@/constants/escrow-roles.constants";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import {
  isStoredMultiReleaseEscrow,
  isStoredSingleReleaseEscrow,
} from "@/features/escrows/types/escrow.types";

export class EscrowRoleContext {
  private readonly normalizedAddress: string | null;

  constructor(
    private readonly escrow: StoredEscrow,
    walletAddress: string | null,
  ) {
    const trimmed = walletAddress?.trim() ?? "";
    this.normalizedAddress = trimmed.length > 0 ? trimmed : null;
  }

  get address(): string | null {
    return this.normalizedAddress;
  }

  get isConnected(): boolean {
    return this.normalizedAddress !== null;
  }

  isAdmin(): boolean {
    return this.matches(this.escrow.roles.admin);
  }

  isApprover(): boolean {
    return this.inList(this.escrow.roles.approvers);
  }

  isServiceProvider(): boolean {
    return this.inList(this.escrow.roles.serviceProviders);
  }

  isReleaseSigner(): boolean {
    return this.inList(this.escrow.roles.releaseSigners);
  }

  isDisputeResolver(): boolean {
    return this.inList(this.escrow.roles.disputeResolvers);
  }

  isPlatform(): boolean {
    return this.matches(this.escrow.roles.platform);
  }

  isObserver(): boolean {
    return this.inList(this.escrow.roles.observers ?? []);
  }

  isEscrowReceiver(): boolean {
    if (!isStoredSingleReleaseEscrow(this.escrow)) {
      return false;
    }

    return this.matches(this.escrow.roles.receiver);
  }

  isMilestoneReceiver(milestoneIndex: number): boolean {
    if (!isStoredMultiReleaseEscrow(this.escrow)) {
      return false;
    }

    const milestone = this.escrow.milestones[milestoneIndex];
    if (!milestone) {
      return false;
    }

    return this.matches(milestone.receiver);
  }

  isAnyMilestoneReceiver(): boolean {
    if (!isStoredMultiReleaseEscrow(this.escrow) || !this.normalizedAddress) {
      return false;
    }

    return this.escrow.milestones.some((milestone) =>
      this.matches(milestone.receiver),
    );
  }

  getConnectedRoleIds(): EscrowRoleId[] {
    if (!this.normalizedAddress) {
      return [];
    }

    const roleIds: EscrowRoleId[] = [];

    if (this.isAdmin()) {
      roleIds.push("admin");
    }
    if (this.isApprover()) {
      roleIds.push("approvers");
    }
    if (this.isServiceProvider()) {
      roleIds.push("service-providers");
    }
    if (this.isReleaseSigner()) {
      roleIds.push("release-signers");
    }
    if (this.isDisputeResolver()) {
      roleIds.push("dispute-resolvers");
    }
    if (this.isPlatform()) {
      roleIds.push("platform");
    }
    if (this.isEscrowReceiver() || this.isAnyMilestoneReceiver()) {
      roleIds.push("receiver");
    }
    if (this.isObserver()) {
      roleIds.push("observers");
    }

    return roleIds;
  }

  canOpenDispute(milestoneIndex?: number): boolean {
    if (this.isDisputeResolver()) {
      return false;
    }

    if (
      this.isApprover() ||
      this.isServiceProvider() ||
      this.isPlatform() ||
      this.isReleaseSigner()
    ) {
      return true;
    }

    if (milestoneIndex === undefined) {
      return this.isEscrowReceiver();
    }

    return this.isMilestoneReceiver(milestoneIndex);
  }

  private matches(candidate: string): boolean {
    if (!this.normalizedAddress) {
      return false;
    }

    return candidate.trim() === this.normalizedAddress;
  }

  private inList(list: readonly string[]): boolean {
    if (!this.normalizedAddress) {
      return false;
    }

    return list.some((address) => address.trim() === this.normalizedAddress);
  }
}
