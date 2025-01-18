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
    isResolveDisputeDialogOpen: false,
    isSuccessDialogOpen: false,

    // Modifiers
    setIsDialogOpen: (value: boolean) => set({ isDialogOpen: value }),
    setIsSecondDialogOpen: (value: boolean) =>
      set({ isSecondDialogOpen: value }),
    setIsQRDialogOpen: (value: boolean) => set({ isQRDialogOpen: value }),
    setIsResolveDisputeDialogOpen: (value: boolean) =>
      set({ isResolveDisputeDialogOpen: value }),
    setIsSuccessDialogOpen: (value: boolean) =>
      set({ isSuccessDialogOpen: value }),
  };
};
