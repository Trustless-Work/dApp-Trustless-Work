import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { DialogEscrowStore, escrowDialogSlice } from "./dialogs.slice";
import { escrowTabsSlice, TabsEscrowStore } from "./tabs.slice";
import { escrowViewModeSlice, ViewModeEscrowStore } from "./view-mode.slice";
import { escrowLoadersSlice, LoadersEscrowStore } from "./loaders.slice";
import { escrowStepsSlice, StepsEscrowStore } from "./steps.slice";
import { AmountEscrowStore, escrowAmountSlice } from "./amounts.slice";

type GlobalState = DialogEscrowStore &
  TabsEscrowStore &
  ViewModeEscrowStore &
  LoadersEscrowStore &
  StepsEscrowStore &
  AmountEscrowStore;

export const useEscrowUIBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...escrowDialogSlice(...a),
      ...escrowTabsSlice(...a),
      ...escrowViewModeSlice(...a),
      ...escrowLoadersSlice(...a),
      ...escrowStepsSlice(...a),
      ...escrowAmountSlice(...a),
    }),
    {
      name: "escrow-ui-store",
    },
  ),
);
