import { StateCreator } from "zustand";
import { ViewModeContactStore } from "../@types/view-mode.entity";

export const useContactViewModeSlice: StateCreator<
  ViewModeContactStore,
  [["zustand/devtools", never]],
  [],
  ViewModeContactStore
> = (set) => {
  return {
    // Stores
    activeMode: "cards",

    // Modifiers
    setActiveMode: (value: "table" | "cards") => set({ activeMode: value }),
  };
};
