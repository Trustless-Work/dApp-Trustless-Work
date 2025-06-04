import { devtools, DevtoolsOptions } from "zustand/middleware";
import { create } from "zustand";
import { useEscrowDialogSlice } from "./slices/dialogs.slice";
import { DialogEscrowStore } from "./@types/dialogs.entity";
import { TabsEscrowStore } from "./@types/tabs.entity";
import { useEscrowTabSlice } from "./slices/tabs.slice";
import { useEscrowViewModeSlice } from "./slices/view-mode.slice";
import { ViewModeEscrowStore } from "./@types/view-mode.entity";
import { useEscrowLoadersSlice } from "./slices/loaders.slice";
import { LoadersEscrowStore } from "./@types/loaders.entity";
import { useEscrowStepsSlice } from "./slices/steps.slice";
import { StepsEscrowStore } from "./@types/steps.entity";
import { AmountEscrowStore } from "./@types/amounts.entity";
import { useEscrowAmountSlice } from "./slices/amounts.slice";

type GlobalState = DialogEscrowStore &
  TabsEscrowStore &
  ViewModeEscrowStore &
  LoadersEscrowStore &
  StepsEscrowStore &
  AmountEscrowStore;

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

export const useEscrowUIBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...useEscrowDialogSlice(...a),
      ...useEscrowTabSlice(...a),
      ...useEscrowViewModeSlice(...a),
      ...useEscrowLoadersSlice(...a),
      ...useEscrowStepsSlice(...a),
      ...useEscrowAmountSlice(...a),
    }),
    devtoolsOptions,
  ),
);
