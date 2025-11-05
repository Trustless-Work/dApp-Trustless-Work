import { StateCreator } from "zustand";

export type DialogEscrowStore = {
  isMoonpayWidgetOpen: boolean;

  setIsMoonpayWidgetOpen: (value: boolean) => void;
};

export const escrowDialogSlice: StateCreator<
  DialogEscrowStore,
  [["zustand/devtools", never]],
  [],
  DialogEscrowStore
> = (set) => {
  return {
    // Stores
    isMoonpayWidgetOpen: false,

    // Modifiers
    setIsMoonpayWidgetOpen: (value: boolean) =>
      set({ isMoonpayWidgetOpen: value }),
  };
};
