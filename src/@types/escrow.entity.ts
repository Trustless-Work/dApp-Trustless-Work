import { CreatedAt, UpdatedAt } from "./dates.entity";

export type Milestone = {
  description: string;
  status?: string; // ! cambiar opcional y tipar con los tipos correctos
};

export interface Escrow {
  id: string;
  title: string;
  description: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  contractId?: string;
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

export type FundEscrowPayload = Pick<
  Escrow,
  "contractId" | "amount" | "engagementId"
> & {
  signer: string;
};

export type EscrowPayload = Omit<
  Escrow,
  "user" | "createdAt" | "updatedAt" | "id"
>;
