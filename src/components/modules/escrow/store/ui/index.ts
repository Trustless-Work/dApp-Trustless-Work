import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useEscrowDialogSlice } from "./slices/dialogs.slice";
import { useEscrowTabSlice } from "./slices/tabs.slice";
import { useEscrowViewModeSlice } from "./slices/view-mode.slice";
import { useEscrowLoadersSlice } from "./slices/loaders.slice";
import { useEscrowStepsSlice } from "./slices/steps.slice";
import { useEscrowAmountSlice } from "./slices/amounts.slice";
import type { DialogEscrowStore } from "./@types/dialogs.entity";
import type { TabsEscrowStore } from "./@types/tabs.entity";
import type { ViewModeEscrowStore } from "./@types/view-mode.entity";
import type { LoadersEscrowStore } from "./@types/loaders.entity";
import type { StepsEscrowStore } from "./@types/steps.entity";
import type { AmountEscrowStore } from "./@types/amounts.entity";

type GlobalState = DialogEscrowStore &
  TabsEscrowStore &
  ViewModeEscrowStore &
  LoadersEscrowStore &
  StepsEscrowStore &
  AmountEscrowStore;

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
    {
      name: "escrow-ui-store",
    },
  ),
);
