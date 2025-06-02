import { create } from "zustand";
import { ModeContactStore } from "./@types/mode.entity";
import { FiltersContactStore } from "./@types/filters.entity";
import { devtools, DevtoolsOptions } from "zustand/middleware";
import { useContactFiltersSlice } from "./slices/filters.slice";
import { useContactModeSlice } from "./slices/mode.slice";

type ContactUIState = ModeContactStore & FiltersContactStore;

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
  stateSanitizer: (state: ContactUIState) => {
    return {
      ...state,
      notificationsApi: "<NOTIFICATIONS_API>",
      contextHolder: "<CONTEXT_HOLDER>",
    };
  },
};

export const useContactUIBoundedStore = create<ContactUIState>()(
  devtools(
    (...a) => ({
      ...useContactModeSlice(...a),
      ...useContactFiltersSlice(...a),
    }),
    devtoolsOptions,
  ),
);
