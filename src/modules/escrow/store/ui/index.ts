import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  PersistOptions,
  persist,
} from "zustand/middleware";
import { escrowTabsSlice, TabsEscrowStore } from "./tabs.slice";
import { escrowViewModeSlice, ViewModeEscrowStore } from "./view-mode.slice";
import { escrowLoadersSlice, LoadersEscrowStore } from "./loaders.slice";
import { escrowStepsSlice, StepsEscrowStore } from "./steps.slice";
import { DialogEscrowStore, escrowDialogSlice } from "./dialogs.slice";
import {
  escrowInitializeDraftSlice,
  InitializeDraftEscrowStore,
} from "./initialize-draft.slice";
import { getClientStorage } from "@/lib/client-storage";

type GlobalState = TabsEscrowStore &
  ViewModeEscrowStore &
  LoadersEscrowStore &
  StepsEscrowStore &
  DialogEscrowStore &
  InitializeDraftEscrowStore;

type PersistedEscrowUIState = Pick<
  GlobalState,
  | "currentStep"
  | "escrowType"
  | "initializeSingleEscrowDraft"
  | "initializeMultiEscrowDraft"
>;

const persistOptions: PersistOptions<GlobalState, PersistedEscrowUIState> = {
  name: "escrow-ui-storage",
  storage: createJSONStorage(getClientStorage),
  partialize: (state) => ({
    currentStep: state.currentStep,
    escrowType: state.escrowType,
    initializeSingleEscrowDraft: state.initializeSingleEscrowDraft,
    initializeMultiEscrowDraft: state.initializeMultiEscrowDraft,
  }),
};

export const useEscrowUIBoundedStore = create<GlobalState>()(
  persist(
    devtools(
      (...a) => ({
        ...escrowDialogSlice(...a),
        ...escrowTabsSlice(...a),
        ...escrowViewModeSlice(...a),
        ...escrowLoadersSlice(...a),
        ...escrowStepsSlice(...a),
        ...escrowInitializeDraftSlice(...a),
      }),
      {
        name: "escrow-ui-store",
      },
    ),
    persistOptions,
  ),
);
