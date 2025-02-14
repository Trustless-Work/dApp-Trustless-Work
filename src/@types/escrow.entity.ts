import { CreatedAt, UpdatedAt } from "./dates.entity";

export type MilestoneStatus = "completed" | "approved" | "pending";

export type Milestone = {
  description: string;
  status?: MilestoneStatus;
  flag?: boolean;
};

export interface Escrow {
  id: string;
  title: string;
  description: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  contractId?: string;
  balance?: string;
  token: string;
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
}

export type RolesInEscrow =
  | "issuer"
  | "approver"
  | "disputeResolver"
  | "serviceProvider"
  | "releaseSigner"
  | "platformAddress";

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
  "user" | "createdAt" | "updatedAt" | "id"
>;

export type ChangeMilestoneStatusPayload = {
  contractId?: string;
  milestoneIndex: string;
  newStatus: MilestoneStatus;
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
    serviceProviderFunds: string;
  };

export type EditMilestonesPayload = {
  contractId: string;
  escrow: EscrowPayload;
  signer: string;
};
