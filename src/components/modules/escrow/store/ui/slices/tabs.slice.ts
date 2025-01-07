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
    activeTab: "issuer",

    // Modifiers
    setActiveTab: (
      value: "issuer" | "client" | "serviceProvider" | "disputeResolver",
    ) => set({ activeTab: value }),
  };
};
