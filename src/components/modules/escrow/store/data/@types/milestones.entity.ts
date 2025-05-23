import { Milestone } from "@/@types/escrows/escrow.entity";

export interface MilestonesEscrowStore {
  completingMilestone: Milestone | null;
  milestoneIndex: number | null;
  setCompletingMilestone: (value: Milestone | null) => void;
  setMilestoneIndex: (value: number | null) => void;
}
