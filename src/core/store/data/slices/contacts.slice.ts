import type { StateCreator } from "zustand";
import type { ContactGlobalStore } from "../@types/contacts.entity";
import type { Contact } from "@/@types/contact.entity";
import {
  addContact,
  getAllContactsByUser,
  updateContact,
  toggleContactStatus,
} from "@/components/modules/contacts/server/contact.firebase";

const CONTACT_ACTIONS = {
  SET_CONTACTS: "contacts/set",
  SET_SELECTED_CONTACT: "contacts/setSelected",
  FETCH_ALL_CONTACTS: "contacts/fetchAll",
  ADD_CONTACT: "contacts/add",
  UPDATE_CONTACT: "contacts/update",
  TOGGLE_CONTACT_STATUS: "contacts/toggleStatus",
  SET_CONTACT_TO_DELETE: "contacts/setToDelete",
  SET_LOADING_CONTACTS: "contacts/setLoading",
  SET_RECENT_CONTACT: "contacts/setRecent",
} as const;

export const CONTACT_SLICE_NAME = "contactSlice" as const;

export const useGlobalContactsSlice: StateCreator<
  ContactGlobalStore,
  [["zustand/devtools", never]],
  [],
  ContactGlobalStore
> = (set) => ({
  contacts: [],
  totalContacts: 0,
  loadingContacts: false,
  contactsToDelete: [],
  selectedContact: null,
  recentContact: undefined,

  setContacts: (contacts: Contact[]) =>
    set({ contacts }, false, CONTACT_ACTIONS.SET_CONTACTS),

  fetchAllContactsByUser: async ({ address, type = "personal" }) => {
    set({ loadingContacts: true }, false, CONTACT_ACTIONS.SET_LOADING_CONTACTS);
    try {
      const response = await getAllContactsByUser({ address, type });

      if (response?.success && Array.isArray(response.data)) {
        set({ loadingContacts: false }, false, CONTACT_ACTIONS.SET_CONTACTS);
      } else {
        set(
          { loadingContacts: false },
          false,
          CONTACT_ACTIONS.SET_LOADING_CONTACTS,
        );
      }
    } catch (error) {
      set(
        { loadingContacts: false },
        false,
        CONTACT_ACTIONS.SET_LOADING_CONTACTS,
      );
      throw error;
    }
  },

  addContact: async (payload) => {
    set({ loadingContacts: true }, false, CONTACT_ACTIONS.SET_LOADING_CONTACTS);
    try {
      const response = await addContact({ payload });

      if (response?.success && response.data) {
        const newContact: Contact = response.data;
        set(
          (state) => ({
            contacts: [newContact, ...state.contacts],
            loadingContacts: false,
          }),
          false,
          CONTACT_ACTIONS.ADD_CONTACT,
        );
        return newContact;
      }
      set(
        { loadingContacts: false },
        false,
        CONTACT_ACTIONS.SET_LOADING_CONTACTS,
      );
      return undefined;
    } catch (error) {
      set(
        { loadingContacts: false },
        false,
        CONTACT_ACTIONS.SET_LOADING_CONTACTS,
      );
      throw error;
    }
  },

  updateContact: async (contactId, payload) => {
    set({ loadingContacts: true }, false, CONTACT_ACTIONS.SET_LOADING_CONTACTS);
    try {
      await updateContact({ contactId, payload });
      set(
        (state) => ({
          contacts: state.contacts.map((contact) =>
            contact.contactId === contactId
              ? { ...contact, ...payload }
              : contact,
          ),
          loadingContacts: false,
        }),
        false,
        CONTACT_ACTIONS.UPDATE_CONTACT,
      );
    } catch (error) {
      set(
        { loadingContacts: false },
        false,
        CONTACT_ACTIONS.SET_LOADING_CONTACTS,
      );
      throw error;
    }
  },

  toggleContactStatus: async (contactId) => {
    set({ loadingContacts: true }, false, CONTACT_ACTIONS.SET_LOADING_CONTACTS);
    try {
      const response = await toggleContactStatus({ contactId });

      if (response?.success && response.data) {
        set(
          (state) => ({
            contacts: state.contacts.map((contact) =>
              contact.contactId === contactId
                ? { ...contact, status: !contact.status }
                : contact,
            ),
            loadingContacts: false,
          }),
          false,
          CONTACT_ACTIONS.TOGGLE_CONTACT_STATUS,
        );
      } else {
        set(
          { loadingContacts: false },
          false,
          CONTACT_ACTIONS.SET_LOADING_CONTACTS,
        );
      }
    } catch (error) {
      set(
        { loadingContacts: false },
        false,
        CONTACT_ACTIONS.SET_LOADING_CONTACTS,
      );
      throw error;
    }
  },
});
