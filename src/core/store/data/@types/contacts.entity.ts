/* eslint-disable @typescript-eslint/no-explicit-any */

import { Contact, ContactPayload } from "@/@types/contact.entity";

export interface ContactGlobalStore {
  contacts: Contact[];
  totalContacts: number;
  loadingContacts: boolean;
  contactsToDelete: string[];
  setContacts: (contacts: Contact[]) => void;
  fetchAllContactsByUser: (params: {
    address: string;
    type: "personal" | "favorites";
  }) => void;
  addContact: (payload: ContactPayload) => Promise<Contact | undefined>;
  updateContact: (contactId: string, payload: ContactPayload) => Promise<void>;
  toggleContactStatus: (contactId: string) => Promise<void>;
}
