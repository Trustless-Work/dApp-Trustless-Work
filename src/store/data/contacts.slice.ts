import { StateCreator } from "zustand";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/modules/contact/server/contact.firebase";
import { Contact } from "@/types/contact.entity";

const CONTACTS_ACTIONS = {
  SET_LOADING: "contacts/setLoading",
  SET_CONTACTS: "contacts/setContacts",
  ADD_CONTACT: "contacts/addContact",
  EDIT_CONTACT: "contacts/editContact",
  REMOVE_CONTACT: "contacts/removeContact",
} as const;

export type ContactsGlobalStore = {
  contacts: Contact[];
  loadingContacts: boolean;

  fetchContacts: (userId: string) => Promise<void>;
  addContact: (userId: string, contact: Contact) => Promise<void>;
  editContact: (
    userId: string,
    contactId: string,
    data: Partial<Contact>,
  ) => Promise<void>;
  removeContact: (userId: string, contactId: string) => Promise<void>;
};

export const contactsSlice: StateCreator<
  ContactsGlobalStore,
  [["zustand/devtools", never]],
  [],
  ContactsGlobalStore
> = (set) => {
  return {
    // Stores
    contacts: [],
    loadingContacts: false,

    // Modifiers
    fetchContacts: async (userId: string) => {
      set({ loadingContacts: true }, false, CONTACTS_ACTIONS.SET_LOADING);
      const contacts = await getContacts(userId);
      set(
        { contacts, loadingContacts: false },
        false,
        CONTACTS_ACTIONS.SET_CONTACTS,
      );
    },

    addContact: async (userId: string, contact: Contact) => {
      await createContact(userId, contact);
      const contacts = await getContacts(userId);
      set({ contacts }, false, CONTACTS_ACTIONS.ADD_CONTACT);
    },

    editContact: async (
      userId: string,
      contactId: string,
      data: Partial<Contact>,
    ) => {
      await updateContact(userId, contactId, data);
      const contacts = await getContacts(userId);
      set({ contacts }, false, CONTACTS_ACTIONS.EDIT_CONTACT);
    },

    removeContact: async (userId: string, contactId: string) => {
      await deleteContact(userId, contactId);
      const contacts = await getContacts(userId);
      set({ contacts }, false, CONTACTS_ACTIONS.REMOVE_CONTACT);
    },
  };
};
