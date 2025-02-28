/* eslint-disable @typescript-eslint/no-explicit-any */

import { Contact, ContactPayload } from "@/@types/contact.entity";

export interface ContactGlobalStore {
  contacts: Contact[];
  totalContacts: number;
  loadingContacts: boolean;
  selectedContact: Contact | null;
  contactsToDelete: string[];
  recentContact: Contact | undefined;

  setContacts: (contacts: Contact[]) => void;
  fetchAllContacts: (params: { userId: string }) => void;
  addContact: (
    payload: ContactPayload,
    userId: string,
  ) => Promise<Contact | undefined>;
  updateContact: (params: {
    contactId: string;
    payload: ContactPayload;
  }) => Promise<Contact | undefined>;
  setRecentContact: (contact: Contact | undefined) => void;
  setSelectedContact: (contact: Contact | undefined) => void;
}
