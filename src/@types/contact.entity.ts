import { CreatedAt, UpdatedAt } from "./dates.entity";

export enum RoleType {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ESCROW_AGENT = "ESCROW_AGENT",
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  role: RoleType;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}
