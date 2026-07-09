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
