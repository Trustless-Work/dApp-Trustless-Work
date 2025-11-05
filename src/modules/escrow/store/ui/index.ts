import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { escrowTabsSlice, TabsEscrowStore } from "./tabs.slice";
import { escrowViewModeSlice, ViewModeEscrowStore } from "./view-mode.slice";
import { escrowLoadersSlice, LoadersEscrowStore } from "./loaders.slice";
import { escrowStepsSlice, StepsEscrowStore } from "./steps.slice";
import { DialogEscrowStore, escrowDialogSlice } from "./dialogs.slice";

type GlobalState = TabsEscrowStore &
  ViewModeEscrowStore &
  LoadersEscrowStore &
  StepsEscrowStore &
  DialogEscrowStore;

export const useEscrowUIBoundedStore = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...escrowDialogSlice(...a),
      ...escrowTabsSlice(...a),
      ...escrowViewModeSlice(...a),
      ...escrowLoadersSlice(...a),
      ...escrowStepsSlice(...a),
    }),
    {
      name: "escrow-ui-store",
    },
  ),
);
