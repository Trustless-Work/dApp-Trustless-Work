import type { CreatedAt, UpdatedAt } from "./dates.entity";

export type ContactCategory = "favorites" | "personal";

export type ContactStatus = false | true;

export interface Contact {
  contactId: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  name: string;
  lastName: string;
  email: string;
  address: string;
  category: ContactCategory[];
  status: ContactStatus;
}

export type ContactPayload = Omit<
  Contact,
  "createdAt" | "updatedAt" | "contactId"
>;
