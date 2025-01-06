import { StateCreator } from "zustand";
import { TabsEscrowStore } from "../@types/tabs.entity";

export const useEscrowTabSlice: StateCreator<
  TabsEscrowStore,
  [["zustand/devtools", never]],
  [],
  TabsEscrowStore
> = (set) => {
  return {
    // Stores
    activeTab: "user",

    // Modifiers
    setActiveTab: (value: "user" | "serviceProvider" | "disputeResolver") =>
      set({ activeTab: value }),
  };
};
