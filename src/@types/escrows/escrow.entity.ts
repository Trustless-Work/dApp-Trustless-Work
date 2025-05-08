import { CreatedAt, UpdatedAt } from "../dates.entity";
import { Trustline } from "../trustline.entity";

export type Milestone = {
  description: string;
  status?: string;
  evidence?: string;
  approvedFlag?: boolean;
  approvedAt?: UpdatedAt;
  completedAt?: UpdatedAt;
};

export type Roles = {
  approver: string;
  serviceProvider: string;
  platformAddress: string;
  releaseSigner: string;
  disputeResolver: string;
  receiver: string;
};

export type Flags = {
  disputeFlag?: boolean;
  releaseFlag?: boolean;
  resolvedFlag?: boolean;
};

export type RolesInEscrow =
  | "issuer"
  | "approver"
  | "disputeResolver"
  | "serviceProvider"
  | "releaseSigner"
  | "platformAddress"
  | "receiver";

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
  milestones: Milestone[];
  flags?: Flags;
  trustline: Trustline;
  receiverMemo?: number;
  disputeStartedBy?: string;
  isActive?: boolean;
  approverFunds?: string;
  receiverFunds?: string;
  user: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}
