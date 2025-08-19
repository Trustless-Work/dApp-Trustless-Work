import { devtools, DevtoolsOptions } from "zustand/middleware";
import { persist, PersistOptions } from "zustand/middleware";
import { create } from "zustand";
import { EscrowGlobalStore, escrowsSlice } from "./escrows.slice";
import { authenticationSlice } from "./authentication.slice";
import { contactsSlice } from "./contacts.slice";
import { AuthenticationGlobalStore } from "./authentication.slice";
import { ContactsGlobalStore } from "./contacts.slice";

type GlobalState = EscrowGlobalStore & ContactsGlobalStore;
type AuthState = AuthenticationGlobalStore;

type PersistedAuthState = Pick<AuthState, "address" | "name" | "loggedUser">;

const devtoolsOptions: DevtoolsOptions = {
  name: "Global State",
  serialize: {
    options: {
      undefined: true,
      function: false,
      symbol: false,
      error: true,
      date: true,
      regexp: true,
      bigint: true,
      map: true,
      set: true,
      depth: 10,
      maxSize: 50000,
    },
  },
  enabled: process.env.NODE_ENV === "development",
  anonymousActionType: "Unknown",
  stateSanitizer: (state: GlobalState) => {
    return {
      ...state,
      notificationsApi: "<NOTIFICATIONS_API>",
      contextHolder: "<CONTEXT_HOLDER>",
    };
  },
};

const persistOptions: PersistOptions<AuthState, PersistedAuthState> = {
  name: "auth-storage",
  partialize: (state: AuthState) => ({
    address: state.address,
    name: state.name,
    loggedUser: state.loggedUser,
  }),
};

export const useGlobalBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...escrowsSlice(...a),
      ...contactsSlice(...a),
    }),
    devtoolsOptions,
  ),
);

export const useGlobalAuthenticationStore = create<AuthState>()(
  persist(
    (...b) => ({
      ...authenticationSlice(...b),
    }),
    persistOptions,
  ),
);
