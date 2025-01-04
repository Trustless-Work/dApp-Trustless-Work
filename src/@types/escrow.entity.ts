import { CreatedAt, UpdatedAt } from "./dates.entity";

export type Milestone = {
  description: string;
};

export interface Escrow {
  serviceProvider: string;
  engagementId: string;
  disputeResolver: string;
  amount: string;
  updatedAt: UpdatedAt;
  milestones: Milestone[];
  platformAddress: string;
  description: string;
  title: string;
  createdAt: CreatedAt;
  user: string;
  platformFee: string;
  client: string;
  releaseSigner: string;
  id: string;
}
