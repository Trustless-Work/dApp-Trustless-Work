import { StateCreator } from "zustand";
import { ViewModeEscrowStore } from "../@types/view-mode.entity";

export const useEscrowViewModeSlice: StateCreator<
  ViewModeEscrowStore,
  [["zustand/devtools", never]],
  [],
  ViewModeEscrowStore
> = (set) => {
  return {
    // Stores
    activeMode: "table",

    // Modifiers
    setActiveMode: (value: "table" | "cards") => set({ activeMode: value }),
  };
};
