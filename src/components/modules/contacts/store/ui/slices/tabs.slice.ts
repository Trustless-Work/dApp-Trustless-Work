import { StateCreator } from "zustand";
import { TabsContactStore } from "../@types/tabs.entity";

export const useContactTabSlice: StateCreator<
  TabsContactStore,
  [["zustand/devtools", never]],
  [],
  TabsContactStore
> = (set) => {
  return {
    // Stores
    activeTab: "personal",

    // Modifiers
    setActiveTab: (value: string) => set({ activeTab: value }),
  };
};
