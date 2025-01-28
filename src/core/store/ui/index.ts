import {
  createJSONStorage,
  devtools,
  DevtoolsOptions,
  persist,
} from "zustand/middleware";
import { create } from "zustand";
import { ThemeGlobalUIStore } from "./@types/theme.entity";
import { useThemeSlice } from "./slices/theme.slice";
import { LoaderGlobalUIStore } from "./@types/loader.entity";
import { useLoaderSlice } from "./slices/loader.slice";
import { StepsGlobalUIStore } from "./@types/steps.entity";
import { useStepsSlice } from "./slices/steps.slice";

type GlobalUIState = ThemeGlobalUIStore &
  LoaderGlobalUIStore &
  StepsGlobalUIStore;

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
        ...useThemeSlice(...a),
        ...useLoaderSlice(...a),
        ...useStepsSlice(...a),
      }),
      devtoolsOptions,
    ),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
