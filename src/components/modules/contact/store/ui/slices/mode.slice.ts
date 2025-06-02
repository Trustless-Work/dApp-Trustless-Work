import { StateCreator } from "zustand";
import { ModeContactStore } from "../@types/mode.entity";

export const useContactModeSlice: StateCreator<
  ModeContactStore,
  [["zustand/devtools", never]],
  [],
  ModeContactStore
> = (set) => {
  return {
    // Stores
    activeMode: "cards",

    // Modifiers
    setActiveMode: (mode) => set({ activeMode: mode }),
  };
};
