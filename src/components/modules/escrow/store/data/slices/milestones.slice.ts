import { StateCreator } from "zustand";
import { MilestonesEscrowStore } from "../@types/milestones.entity";
import { Milestone } from "@/@types/escrow.entity";

export const useEscrowMilestoneSlice: StateCreator<
  MilestonesEscrowStore,
  [["zustand/devtools", never]],
  [],
  MilestonesEscrowStore
> = (set) => {
  return {
    // Stores
    completingMilestone: null,
    milestoneIndex: null,

    // Modifiers
    setCompletingMilestone: (value: Milestone | null) =>
      set({ completingMilestone: value }),
    setMilestoneIndex: (value: number | null) => set({ milestoneIndex: value }),
  };
};
