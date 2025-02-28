import type { CreatedAt, UpdatedAt } from "./dates.entity";

export type ContactType = "personal" | "favorite";

export interface Contact {
  id: string;
  name: string;
  lastName: string;
  email: string;
  address: string;
  type: ContactType;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  userId: string;
}

// Payloads
export type ContactPayload = Omit<Contact, "id" | "createdAt" | "updatedAt">;

export interface UpdateContactPayload {
  contactId: string;
  contact: Partial<ContactPayload>;
}

export interface DeleteContactPayload {
  contactId: string;
}
