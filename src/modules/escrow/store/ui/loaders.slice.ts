import { StateCreator } from "zustand";

export type LoadersEscrowStore = {
  isInitializingEscrow: boolean;
  isChangingStatus: boolean;
  isChangingFlag: boolean;
  isReleasingFunds: boolean;
  isStartingDispute: boolean;
  isFundingEscrow: boolean;
  isEditingMilestones: boolean;
  isEditingEntities: boolean;
  isEditingBasicProperties: boolean;
  isResolvingDispute: boolean;
  isWithdrawingRemainingFunds: boolean;

  setIsInitializingEscrow: (value: boolean) => void;
  setIsChangingStatus: (value: boolean) => void;
  setIsChangingFlag: (value: boolean) => void;
  setIsReleasingFunds: (value: boolean) => void;
  setIsStartingDispute: (value: boolean) => void;
  setIsFundingEscrow: (value: boolean) => void;
  setIsEditingMilestones: (value: boolean) => void;
  setIsEditingEntities: (value: boolean) => void;
  setIsEditingBasicProperties: (value: boolean) => void;
  setIsResolvingDispute: (value: boolean) => void;
  setIsWithdrawingRemainingFunds: (value: boolean) => void;
};

export const escrowLoadersSlice: StateCreator<
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
    isWithdrawingRemainingFunds: false,

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
    setIsWithdrawingRemainingFunds: (value: boolean) =>
      set({ isWithdrawingRemainingFunds: value }),
  };
};
