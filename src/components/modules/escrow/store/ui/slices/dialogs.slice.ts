import { StateCreator } from "zustand";
import { DialogEscrowStore } from "../@types/dialogs.entity";

export const useEscrowDialogSlice: StateCreator<
  DialogEscrowStore,
  [["zustand/devtools", never]],
  [],
  DialogEscrowStore
> = (set) => {
  return {
    // Stores
    isDialogOpen: false,
    isSecondDialogOpen: false,
    isQRDialogOpen: false,
    isEditMilestoneDialogOpen: false,
    isResolveDisputeDialogOpen: false,
    isSuccessDialogOpen: false,
    isSuccessReleaseDialogOpen: false,
    isSuccessResolveDisputeDialogOpen: false,
    isMoonpayWidgetOpen: false,

    // Modifiers
    setIsDialogOpen: (value: boolean) => set({ isDialogOpen: value }),
    setIsSecondDialogOpen: (value: boolean) =>
      set({ isSecondDialogOpen: value }),
    setIsQRDialogOpen: (value: boolean) => set({ isQRDialogOpen: value }),
    setIsEditMilestoneDialogOpen: (value: boolean) =>
      set({ isEditMilestoneDialogOpen: value }),
    setIsResolveDisputeDialogOpen: (value: boolean) =>
      set({ isResolveDisputeDialogOpen: value }),
    setIsSuccessDialogOpen: (value: boolean) =>
      set({ isSuccessDialogOpen: value }),
    setIsSuccessReleaseDialogOpen: (value: boolean) =>
      set({ isSuccessReleaseDialogOpen: value }),
    setIsSuccessResolveDisputeDialogOpen: (value: boolean) =>
      set({ isSuccessResolveDisputeDialogOpen: value }),
    setIsMoonpayWidgetOpen: (value: boolean) =>
      set({ isMoonpayWidgetOpen: value }),
  };
};
