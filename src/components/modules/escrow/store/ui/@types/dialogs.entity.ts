export interface DialogEscrowStore {
  isDialogOpen: boolean;
  isSecondDialogOpen: boolean;
  isQRDialogOpen: boolean;
  isResolveDisputeDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setIsSecondDialogOpen: (value: boolean) => void;
  setIsQRDialogOpen: (value: boolean) => void;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
}
