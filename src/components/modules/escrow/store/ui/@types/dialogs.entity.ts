export interface DialogEscrowStore {
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
  isCompleteMilestoneDialogOpen: boolean;
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
  setIsCompleteMilestoneDialogOpen: (value: boolean) => void;
}
