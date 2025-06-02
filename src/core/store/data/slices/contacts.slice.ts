import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/components/modules/contact/server/contact.firebase";
import { Contact } from "@/@types/contact.entity";

interface ContactState {
  contacts: Contact[];
  loading: boolean;
  fetchContacts: (userId: string) => Promise<void>;
  addContact: (userId: string, contact: Contact) => Promise<void>;
  editContact: (
    userId: string,
    contactId: string,
    data: Partial<Contact>,
  ) => Promise<void>;
  removeContact: (userId: string, contactId: string) => Promise<void>;
}

export const useContactStore = create<ContactState>()(
  devtools((set) => ({
    contacts: [],
    loading: false,
    fetchContacts: async (userId: string) => {
      set({ loading: true });
      const contacts = await getContacts(userId);
      set({ contacts, loading: false });
    },
    addContact: async (userId: string, contact: Contact) => {
      await createContact(userId, contact);
      await getContacts(userId);
    },
    editContact: async (
      userId: string,
      contactId: string,
      data: Partial<Contact>,
    ) => {
      await updateContact(userId, contactId, data);
      await getContacts(userId);
    },
    removeContact: async (userId: string, contactId: string) => {
      await deleteContact(userId, contactId);
      await getContacts(userId);
    },
  })),
);
