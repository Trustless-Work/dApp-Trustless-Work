import type { Escrow } from "./escrow.entity";

// Payload base
export type EscrowPayload = Escrow;

export type InitializeEscrowPayload = Omit<
  EscrowPayload,
  "contractId" | "id" | "user" | "createdAt" | "updatedAt"
> & {
  issuer?: string;
};

export type ChangeMilestoneStatusPayload = {
  contractId?: string;
  milestoneIndex?: string;
  newStatus?: string;
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

export type StartDisputePayload = {
  contractId?: string;
  signer?: string;
};

export type ResolveDisputePayload = {
  contractId?: string;
  disputeResolver?: string;
  approverFunds: string;
  receiverFunds: string;
};

export type FundEscrowPayload = {
  amount: string;
  contractId?: string;
  signer?: string;
};

export type GetEscrowPayload = {
  contractId?: string;
  signer?: string;
};

export type ReleaseFundsEscrowPayload = {
  contractId?: string;
  serviceProvider?: string;
  releaseSigner?: string;
  signer?: string;
};

export type UpdateEscrowPayload = {
  contractId?: string;
  escrow: EscrowPayload;
  signer?: string;
};

export type GetBalanceParams = {
  signer?: string;
  addresses: string[];
};

export type EscrowPayloadService =
  | Escrow
  | InitializeEscrowPayload
  | GetEscrowPayload
  | ChangeMilestoneStatusPayload
  | ChangeMilestoneFlagPayload
  | StartDisputePayload
  | ResolveDisputePayload
  | FundEscrowPayload
  | ReleaseFundsEscrowPayload
  | UpdateEscrowPayload
  | GetBalanceParams;
