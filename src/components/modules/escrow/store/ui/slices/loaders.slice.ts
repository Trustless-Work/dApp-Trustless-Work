import { StateCreator } from "zustand";
import { LoadersEscrowStore } from "../@types/loaders.entity";

export const useEscrowLoadersSlice: StateCreator<
  LoadersEscrowStore,
  [["zustand/devtools", never]],
  [],
  LoadersEscrowStore
> = (set) => {
  return {
    // Stores
    isChangingStatus: false,
    isDistributingEarnings: false,
    isStartingDispute: false,
    isFundingEscrow: false,
    isEditingMilestones: false,

    // Modifiers
    setIsChangingStatus: (value: boolean) => set({ isChangingStatus: value }),
    setIsDistributingEarnings: (value: boolean) =>
      set({ isDistributingEarnings: value }),
    setIsStartingDispute: (value: boolean) => set({ isStartingDispute: value }),
    setIsFundingEscrow: (value: boolean) => set({ isFundingEscrow: value }),
    setIsEditingMilestones: (value: boolean) =>
      set({ isEditingMilestones: value }),
  };
};
