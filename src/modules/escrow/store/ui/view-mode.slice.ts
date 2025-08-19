import { StateCreator } from "zustand";

export type ViewModeEscrowStore = {
  activeMode: "table" | "cards";
  setActiveMode: (value: "table" | "cards") => void;
};

export const escrowViewModeSlice: StateCreator<
  ViewModeEscrowStore,
  [["zustand/devtools", never]],
  [],
  ViewModeEscrowStore
> = (set) => {
  return {
    // Stores
    activeMode: "cards",

    // Modifiers
    setActiveMode: (value: "table" | "cards") => set({ activeMode: value }),
  };
};
