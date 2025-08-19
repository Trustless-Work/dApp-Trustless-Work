import { StateCreator } from "zustand";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";

export type MilestonesEscrowStore = {
  completingMilestone: MultiReleaseMilestone | SingleReleaseMilestone | null;
  milestoneIndex: number | null;
  setCompletingMilestone: (
    value: MultiReleaseMilestone | SingleReleaseMilestone | null,
  ) => void;
  setMilestoneIndex: (value: number | null) => void;
};

export const escrowMilestonesSlice: StateCreator<
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
