export interface DialogEscrowStore {
  isDialogOpen: boolean;
  isSecondDialogOpen: boolean;
  isQRDialogOpen: boolean;
  isEditMilestoneDialogOpen: boolean;
  isResolveDisputeDialogOpen: boolean;
  isSuccessDialogOpen: boolean;
  isSuccessReleaseDialogOpen: boolean;
  isSuccessResolveDisputeDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setIsSecondDialogOpen: (value: boolean) => void;
  setIsQRDialogOpen: (value: boolean) => void;
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
  setIsSuccessDialogOpen: (value: boolean) => void;
  setIsSuccessReleaseDialogOpen: (value: boolean) => void;
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
}
