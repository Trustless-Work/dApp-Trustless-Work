import { StateCreator } from "zustand";

export type DialogEscrowStore = {
  isDialogOpen: boolean;
  isSecondDialogOpen: boolean;
  isQRDialogOpen: boolean;
  isEditMilestoneDialogOpen: boolean;
  isEditEntitiesDialogOpen: boolean;
  isEditBasicPropertiesDialogOpen: boolean;
  isResolveDisputeDialogOpen: boolean;
  isSuccessDialogOpen: boolean;
  isSuccessReleaseDialogOpen: boolean;
  isSuccessResolveDisputeDialogOpen: boolean;
  isMoonpayWidgetOpen: boolean;
  isChangeMilestoneStatusDialogOpen: boolean;

  setIsDialogOpen: (value: boolean) => void;
  setIsSecondDialogOpen: (value: boolean) => void;
  setIsQRDialogOpen: (value: boolean) => void;
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
  setIsEditEntitiesDialogOpen: (value: boolean) => void;
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
  setIsSuccessDialogOpen: (value: boolean) => void;
  setIsSuccessReleaseDialogOpen: (value: boolean) => void;
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
  setIsMoonpayWidgetOpen: (value: boolean) => void;
  setIsChangeMilestoneStatusDialogOpen: (value: boolean) => void;
};

export const escrowDialogSlice: StateCreator<
  DialogEscrowStore,
  [["zustand/devtools", never]],
  [],
  DialogEscrowStore
> = (set) => {
  return {
    // Stores
    isDialogOpen: false,
    isSecondDialogOpen: false,
    isQRDialogOpen: false,
    isEditMilestoneDialogOpen: false,
    isEditEntitiesDialogOpen: false,
    isEditBasicPropertiesDialogOpen: false,
    isResolveDisputeDialogOpen: false,
    isSuccessDialogOpen: false,
    isSuccessReleaseDialogOpen: false,
    isSuccessResolveDisputeDialogOpen: false,
    isMoonpayWidgetOpen: false,
    isChangeMilestoneStatusDialogOpen: false,

    // Modifiers
    setIsDialogOpen: (value: boolean) => set({ isDialogOpen: value }),
    setIsSecondDialogOpen: (value: boolean) =>
      set({ isSecondDialogOpen: value }),
    setIsQRDialogOpen: (value: boolean) => set({ isQRDialogOpen: value }),
    setIsEditMilestoneDialogOpen: (value: boolean) =>
      set({ isEditMilestoneDialogOpen: value }),
    setIsEditEntitiesDialogOpen: (value: boolean) =>
      set({ isEditEntitiesDialogOpen: value }),
    setIsEditBasicPropertiesDialogOpen: (value: boolean) =>
      set({ isEditBasicPropertiesDialogOpen: value }),
    setIsResolveDisputeDialogOpen: (value: boolean) =>
      set({ isResolveDisputeDialogOpen: value }),
    setIsSuccessDialogOpen: (value: boolean) =>
      set({ isSuccessDialogOpen: value }),
    setIsSuccessReleaseDialogOpen: (value: boolean) =>
      set({ isSuccessReleaseDialogOpen: value }),
    setIsSuccessResolveDisputeDialogOpen: (value: boolean) =>
      set({ isSuccessResolveDisputeDialogOpen: value }),
    setIsMoonpayWidgetOpen: (value: boolean) =>
      set({ isMoonpayWidgetOpen: value }),
    setIsChangeMilestoneStatusDialogOpen: (value: boolean) =>
      set({ isChangeMilestoneStatusDialogOpen: value }),
  };
};
