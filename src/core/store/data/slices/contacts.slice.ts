import { create } from "zustand";
import {
  getUserContacts,
  addUserContact,
  updateUserContact,
  deleteUserContact,
} from "@/components/modules/contact/server/contact.firebase";
import { Contact } from "@/@types/contact.entity";

interface ContactStore {
  contacts: Contact[];
  loading: boolean;
  fetchContacts: (userId: string) => Promise<void>;
  addContact: (userId: string, data: Contact) => Promise<void>;
  updateContact: (
    userId: string,
    id: string,
    data: Partial<Contact>,
  ) => Promise<void>;
  deleteContact: (userId: string, id: string) => Promise<void>;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  loading: false,
  fetchContacts: async (userId) => {
    set({ loading: true });
    const contacts = await getUserContacts(userId);
    set({ contacts, loading: false });
  },
  addContact: async (userId, data) => {
    await addUserContact(userId, data);
    await get().fetchContacts(userId);
  },
  updateContact: async (userId, id, data) => {
    await updateUserContact(userId, id, data);
    await get().fetchContacts(userId);
  },
  deleteContact: async (userId, id) => {
    await deleteUserContact(userId, id);
    await get().fetchContacts(userId);
  },
}));
