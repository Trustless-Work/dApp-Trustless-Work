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
    isInitializingEscrow: false,
    isChangingStatus: false,
    isChangingFlag: false,
    isReleasingFunds: false,
    isStartingDispute: false,
    isFundingEscrow: false,
    isEditingMilestones: false,
    isEditingEntities: false,
    isEditingBasicProperties: false,
    isResolvingDispute: false,

    // Modifiers
    setIsInitializingEscrow: (value: boolean) =>
      set({ isInitializingEscrow: value }),
    setIsChangingStatus: (value: boolean) => set({ isChangingStatus: value }),
    setIsChangingFlag: (value: boolean) => set({ isChangingFlag: value }),
    setIsReleasingFunds: (value: boolean) => set({ isReleasingFunds: value }),
    setIsStartingDispute: (value: boolean) => set({ isStartingDispute: value }),
    setIsFundingEscrow: (value: boolean) => set({ isFundingEscrow: value }),
    setIsEditingMilestones: (value: boolean) =>
      set({ isEditingMilestones: value }),
    setIsEditingEntities: (value: boolean) => set({ isEditingEntities: value }),
    setIsEditingBasicProperties: (value: boolean) =>
      set({ isEditingBasicProperties: value }),
    setIsResolvingDispute: (value: boolean) =>
      set({ isResolvingDispute: value }),
  };
};
