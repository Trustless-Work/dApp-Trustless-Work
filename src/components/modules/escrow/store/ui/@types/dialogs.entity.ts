export interface DialogEscrowStore {
  isDialogOpen: boolean;
  isSecondDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setIsSecondDialogOpen: (value: boolean) => void;
}
