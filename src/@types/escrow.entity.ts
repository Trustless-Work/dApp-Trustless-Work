import {
  EscrowType,
  Flags,
  SingleReleaseMilestone,
  MultiReleaseMilestone,
  Roles,
  Trustline,
} from "@trustless-work/escrow";
import { CreatedAt, UpdatedAt } from "./dates.entity";

export type RolesInEscrow =
  | "issuer"
  | "approver"
  | "disputeResolver"
  | "serviceProvider"
  | "releaseSigner"
  | "platformAddress"
  | "receiver";

export type MilestoneStatus = "completed" | "approved" | "pending";

export interface BalanceItem {
  address: string;
  balance: number;
}

export interface Escrow {
  id: string;
  signer?: string;
  contractId?: string;
  engagementId: string;
  title: string;
  roles: Roles;
  description: string;
  amount: string;
  platformFee: string;
  balance?: string;
  milestones: SingleReleaseMilestone[] | MultiReleaseMilestone[];
  flags?: Flags;
  trustline: Trustline & { name: string };
  receiverMemo?: number;
  disputeStartedBy?: string;
  isActive?: boolean;
  approverFunds?: string;
  receiverFunds?: string;
  user: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  type: EscrowType;
}
