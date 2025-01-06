import { CreatedAt, UpdatedAt } from "./dates.entity";

export type Milestone = {
  description: string;
};

export interface Escrow {
  serviceProvider: string;
  engagementId: string;
  disputeResolver: string;
  amount: string;
  platformAddress: string;
  milestones: Milestone[];
  description: string;
  title: string;
  platformFee: string;
  client: string;
  releaseSigner: string;
  user: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  id: string;
}

export type EscrowPayload = Omit<
  Escrow,
  "user" | "createdAt" | "updatedAt" | "id"
>;
