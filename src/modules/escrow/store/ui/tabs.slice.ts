import { StateCreator } from "zustand";
import { EscrowType, Role } from "@trustless-work/escrow";

export type TabsEscrowStore = {
  activeTab: Role;
  escrowType: EscrowType | null;
  setActiveTab: (value: Role) => void;
  setEscrowType: (value: EscrowType | null) => void;
};

export const escrowTabsSlice: StateCreator<
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
