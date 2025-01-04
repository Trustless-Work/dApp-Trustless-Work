import { devtools, DevtoolsOptions } from "zustand/middleware";
import { EscrowGlobalStore } from "./@types/escrows.entity";
import { create } from "zustand";
import { useGlobalEscrowsSlice } from "./slices/escrows.slice";

type GlobalState = EscrowGlobalStore;

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
    }),
    devtoolsOptions,
  ),
);
