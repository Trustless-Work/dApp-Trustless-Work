import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";

export interface MilestonesEscrowStore {
  completingMilestone: MultiReleaseMilestone | SingleReleaseMilestone | null;
  milestoneIndex: number | null;
  setCompletingMilestone: (
    value: MultiReleaseMilestone | SingleReleaseMilestone | null,
  ) => void;
  setMilestoneIndex: (value: number | null) => void;
}
