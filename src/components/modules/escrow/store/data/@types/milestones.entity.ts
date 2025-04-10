import { Milestone } from "@/@types/escrow.entity";

export interface MilestonesEscrowStore {
  completingMilestone: Milestone | null;
  setCompletingMilestone: (value: Milestone | null) => void;
}
