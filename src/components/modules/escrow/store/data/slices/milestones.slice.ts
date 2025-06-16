import { StateCreator } from "zustand";
import { MilestonesEscrowStore } from "../@types/milestones.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";

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
    setCompletingMilestone: (
      value: MultiReleaseMilestone | SingleReleaseMilestone | null,
    ) => set({ completingMilestone: value }),
    setMilestoneIndex: (value: number | null) => set({ milestoneIndex: value }),
  };
};
