import type { CreatedAt, UpdatedAt } from "./dates.entity";
import { Trustline } from "./trustline.entity";

export type MilestoneStatus = "completed" | "approved" | "pending";

export type Milestone = {
  description: string;
  status?: MilestoneStatus;
  approved_flag?: boolean;
  evidence?: string;
  approvedAt?: UpdatedAt;
  completedAt?: UpdatedAt;
};

export interface Escrow {
  id: string;
  title: string;
  description: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  contractId?: string;
  balance?: string;
  trustline?: Trustline;
  milestones: Milestone[];
  serviceProvider: string;
  engagementId: string;
  disputeResolver: string;
  amount: string;
  platformAddress: string;
  platformFee: string;
  approver: string;
  releaseSigner: string;
  user: string;
  issuer: string;
  disputeFlag?: boolean;
  releaseFlag?: boolean;
  resolvedFlag?: boolean;
  approverFunds?: string;
  receiverFunds?: string;
  receiver?: string;
  receiverMemo?: number;
  disputeStartedBy?: string;
}

export type RolesInEscrow =
  | "issuer"
  | "approver"
  | "disputeResolver"
  | "serviceProvider"
  | "releaseSigner"
  | "platformAddress"
  | "receiver";

// Payloads
export type FundEscrowPayload = Pick<Escrow, "amount" | "contractId"> & {
  signer: string;
};

export type DistributeEscrowEarningsEscrowPayload = Pick<Escrow, "contractId"> &
  Partial<Pick<Escrow, "serviceProvider" | "releaseSigner">> & {
    signer: string;
  };

export type EscrowPayload = Omit<
  Escrow,
  "user" | "createdAt" | "updatedAt" | "id" | "trustline"
>;

export type ChangeMilestoneStatusPayload = Omit<
  Milestone,
  "description" | "status" | "approved_flag"
> & {
  contractId?: string;
  milestoneIndex: string;
  newStatus: MilestoneStatus;
  newEvidence?: string;
  serviceProvider?: string;
};

export type ChangeMilestoneFlagPayload = Omit<
  ChangeMilestoneStatusPayload,
  "serviceProvider" | "newStatus"
> & {
  approver?: string;
  newFlag: boolean;
};

export type StartDisputePayload = Pick<Escrow, "contractId"> & {
  signer: string;
};

export type ResolveDisputePayload = Pick<Escrow, "contractId"> &
  Partial<Pick<Escrow, "disputeResolver">> & {
    approverFunds: string;
    receiverFunds: string;
  };

export type EditEscrowPayload = {
  contractId: string;
  escrow: EscrowPayload;
  signer: string;
};

export interface BalanceItem {
  address: string;
  balance: number;
}
