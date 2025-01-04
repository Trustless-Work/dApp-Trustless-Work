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

    // Modifiers
    setIsDialogOpen: (value: boolean) => set({ isDialogOpen: value }),
  };
};
