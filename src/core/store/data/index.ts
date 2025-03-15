import { devtools, DevtoolsOptions, persist } from "zustand/middleware";
import { EscrowGlobalStore } from "./@types/escrows.entity";
import { create } from "zustand";
import { useGlobalEscrowsSlice } from "./slices/escrows.slice";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";
import { AuthenticationGlobalStore } from "./@types/authentication.entity";
import { useGlobalContactsSlice } from "./slices/contacts.slice";
import { ContactGlobalStore } from "./@types/contacts.entity";

type GlobalState = EscrowGlobalStore & ContactGlobalStore;
type AuthState = AuthenticationGlobalStore;

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

export const useGlobalBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...useGlobalEscrowsSlice(...a),
      ...useGlobalContactsSlice(...a),
    }),
    devtoolsOptions,
  ),
);

export const useGlobalAuthenticationStore = create<AuthState>()(
  persist(
    (...b) => ({
      ...useGlobalAuthenticationSlice(...b),
    }),
    {
      name: "address-wallet",
    },
  ),
);
