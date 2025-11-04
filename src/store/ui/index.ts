import {
  createJSONStorage,
  devtools,
  DevtoolsOptions,
  persist,
} from "zustand/middleware";
import { create } from "zustand";
import { themeSlice, ThemeGlobalUIStore } from "./theme.slice";
import { stepsSlice, StepsGlobalUIStore } from "./steps.slice";
import { tutorialSlice, TutorialGlobalUIStore } from "./tutorial.slice";
import { copySlice, CopyGlobalUIStore } from "./copy.slice";

type GlobalUIState = ThemeGlobalUIStore &
  StepsGlobalUIStore &
  TutorialGlobalUIStore &
  CopyGlobalUIStore;

const devtoolsOptions: DevtoolsOptions = {
  name: "Global UI State",
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
  stateSanitizer: (state: GlobalUIState) => {
    return {
      ...state,
      notificationsApi: "<NOTIFICATIONS_API>",
      contextHolder: "<CONTEXT_HOLDER>",
    };
  },
};

export const useGlobalUIBoundedStore = create<GlobalUIState>()(
  persist(
    devtools(
      (...a) => ({
        ...themeSlice(...a),
        ...stepsSlice(...a),
        ...tutorialSlice(...a),
        ...copySlice(...a),
      }),
      devtoolsOptions,
    ),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Exclude copiedKeyId from persistence as it's a temporary UI state
        const { copiedKeyId, ...rest } = state;
        return rest;
      },
    },
  ),
);
