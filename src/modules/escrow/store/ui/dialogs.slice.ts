import { StateCreator } from "zustand";

export type DialogEscrowStore = {
  isMoonpayWidgetOpen: boolean;
  isSuccessDialogOpen: boolean;

  setIsMoonpayWidgetOpen: (value: boolean) => void;
  setIsSuccessDialogOpen: (value: boolean) => void;
};

export const escrowDialogSlice: StateCreator<
  DialogEscrowStore,
  [["zustand/devtools", never]],
  [],
  DialogEscrowStore
> = (set) => {
  return {
    // Stores
    isSuccessDialogOpen: false,
    isMoonpayWidgetOpen: false,

    // Modifiers
    setIsSuccessDialogOpen: (value: boolean) =>
      set({ isSuccessDialogOpen: value }),
    setIsMoonpayWidgetOpen: (value: boolean) =>
      set({ isMoonpayWidgetOpen: value }),
  };
};
