import { devtools, DevtoolsOptions, persist } from "zustand/middleware";
import { create } from "zustand";

import { EscrowGlobalStore } from "./@types/escrows.entity";
import { ContactGlobalStore } from "./@types/contacts.entity";
import { TrustlineGlobalStore } from "./@types/trustlines.entity";
import { AuthenticationGlobalStore } from "./@types/authentication.entity";

import { useGlobalEscrowsSlice } from "./slices/escrows.slice";
import { useGlobalContactsSlice } from "./slices/contacts.slice";
import { useGlobalTrustlinesSlice } from "./slices/trustlines.slice";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";

type GlobalState = EscrowGlobalStore & ContactGlobalStore & TrustlineGlobalStore;
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
      ...useGlobalTrustlinesSlice(...a),
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
