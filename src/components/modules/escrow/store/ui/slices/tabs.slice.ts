import { StateCreator } from "zustand";
import { TabsEscrowStore } from "../@types/tabs.entity";

export const useEscrowTabSlice: StateCreator<
  TabsEscrowStore,
  [["zustand/devtools", never]],
  [],
  TabsEscrowStore
> = (set) => ({
  activeTab: "signer",
  escrowType: null,
  setActiveTab: (value) => set({ activeTab: value }),
  setEscrowType: (value) => set({ escrowType: value }),
});
