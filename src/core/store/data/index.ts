import { devtools, DevtoolsOptions } from "zustand/middleware";
import { persist, PersistOptions } from "zustand/middleware";
import { EscrowGlobalStore } from "./@types/escrows.entity";
import { create } from "zustand";
import { useGlobalEscrowsSlice } from "./slices/escrows.slice";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";
import { AuthenticationGlobalStore } from "./@types/authentication.entity";

type GlobalState = EscrowGlobalStore;
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
      ...useGlobalEscrowsSlice(...a),
    }),
    devtoolsOptions,
  ),
);

export const useGlobalAuthenticationStore = create<AuthState>()(
  persist(
    (...b) => ({
      ...useGlobalAuthenticationSlice(...b),
    }),
    persistOptions,
  ),
);
