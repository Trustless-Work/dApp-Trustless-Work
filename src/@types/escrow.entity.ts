import { CreatedAt, UpdatedAt } from "./dates.entity";

export type MilestoneStatus =
  | "cancelled"
  | "completed"
  | "forReview"
  | "inDispute"
  | "approved"
  | "pending";

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
  milestones: Milestone[];
  serviceProvider: string;
  engagementId: string;
  disputeResolver: string;
  amount: string;
  platformAddress: string;
  platformFee: string;
  client: string;
  releaseSigner: string;
  user: string;
  issuer: string;
  disputeFlag?: boolean;
}

export type RolesInEscrow =
  | "issuer"
  | "client"
  | "disputeResolver"
  | "serviceProvider"
  | "releaseSigner";

export type FundEscrowPayload = Pick<Escrow, "amount"> & {
  issuer: string;
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
  client?: string;
  newFlag: boolean;
};

export type StartDisputePayload = Pick<Escrow, "contractId"> & {
  signer: string;
};

export type ResolveDisputePayload = Pick<
  Escrow,
  "contractId" | "disputeResolver"
> & {
  clientFunds: string;
  serviceProviderFunds: string;
};
