import { StateCreator } from "zustand";
import { TabsEscrowStore } from "../@types/tabs.entity";
import { RolesInEscrow } from "@/@types/escrows/escrow.entity";

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
    setActiveTab: (value: RolesInEscrow) => set({ activeTab: value }),
  };
};
