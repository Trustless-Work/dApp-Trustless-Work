import { CreatedAt, UpdatedAt } from "./dates.entity";
import { Contact } from "./contact.entity";

export interface User {
  id: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  firstName?: string;
  lastName?: string;
  email?: string;
  identification?: string;
  phone?: string;
  country?: string;
  saveEscrow?: boolean;
  useCase?: string;
  apiKey?: string[];
  profileImage?: string;
  address?: string;
  contacts?: Contact[];
}

export type UserPayload = Omit<User, "createdAt" | "updatedAt" | "id">;
