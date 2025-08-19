import { StateCreator } from "zustand";

export type ModeContactStore = {
  activeMode: "table" | "cards";
  setActiveMode: (value: "table" | "cards") => void;
};

export const contactModeSlice: StateCreator<
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
