import {
  EscrowType,
  Flags,
  SingleReleaseMilestone,
  MultiReleaseMilestone,
  Roles,
  Trustline,
} from "@trustless-work/escrow";
import { CreatedAt, UpdatedAt } from "./dates.entity";

export type MilestoneStatus = "approved" | "pending";

export interface Escrow {
  signer?: string;
  contractId?: string;
  engagementId: string;
  title: string;
  roles: Roles;
  description: string;
  amount: number;
  platformFee: number;
  balance?: number;
  milestones: SingleReleaseMilestone[] | MultiReleaseMilestone[];
  flags?: Flags;
  trustline: Trustline & { name: string };
  receiverMemo?: number;
  disputeStartedBy?: string;
  fundedBy?: string;
  isActive?: boolean;
  user: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  type: EscrowType;
}

export type SingleReleaseEscrowStatus =
  | "working"
  | "pendingRelease"
  | "released"
  | "resolved"
  | "inDispute";
