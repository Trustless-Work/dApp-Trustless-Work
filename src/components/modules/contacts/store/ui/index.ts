import { devtools, DevtoolsOptions } from "zustand/middleware";
import { create } from "zustand";
import { useContactInitializeFormSlice } from "./slices/initialize-form.slice";
import { useContactViewModeSlice } from "./slices/view-mode.slice";
import { InitializeFormContactStore } from "./@types/initialize-form.entity";
import { ViewModeContactStore } from "./@types/view-mode.entity";
import { useContactTabSlice } from "./slices/tabs.slice";
import { TabsContactStore } from "./@types/tabs.entity";
import { StepsContactStore } from "./@types/steps.entity";
import { useContactStepsSlice } from "./slices/steps.slice";

type GlobalState = InitializeFormContactStore &
  ViewModeContactStore &
  TabsContactStore &
  StepsContactStore;

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

export const useContactBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...useContactInitializeFormSlice(...a),
      ...useContactViewModeSlice(...a),
      ...useContactTabSlice(...a),
      ...useContactStepsSlice(...a),
    }),
    devtoolsOptions,
  ),
);
