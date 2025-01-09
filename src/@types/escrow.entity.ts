import { CreatedAt, UpdatedAt } from "./dates.entity";

export type Milestone = {
  description: string;
  status?: string; // ! todo: tipar con los tipos correctos
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
}

export type FundEscrowPayload = Pick<Escrow, "amount"> & {
  issuer: string;
};

export type EscrowPayload = Omit<
  Escrow,
  "user" | "createdAt" | "updatedAt" | "id"
>;
