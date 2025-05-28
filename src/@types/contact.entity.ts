import { CreatedAt, UpdatedAt } from "./dates.entity";

export enum RoleType {
  ISSUER = "ISSUER",
  APPROVER = "APPROVER",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  DISPUTE_RESOLVER = "DISPUTE_RESOLVER",
  RELEASE_SIGNER = "RELEASE_SIGNER",
  PLATFORM_ADDRESS = "PLATFORM_ADDRESS",
  RECEIVER = "RECEIVER",
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
