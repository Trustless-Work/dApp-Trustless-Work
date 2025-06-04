import { Milestone } from "@trustless-work/escrow/types";

export interface MilestonesEscrowStore {
  completingMilestone: Milestone | null;
  milestoneIndex: number | null;
  setCompletingMilestone: (value: Milestone | null) => void;
  setMilestoneIndex: (value: number | null) => void;
}
