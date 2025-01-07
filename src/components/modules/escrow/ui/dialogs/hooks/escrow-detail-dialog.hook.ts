import { Escrow } from "@/@types/escrow.entity";

interface useEscrowDetailDialogProps {
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
}

const useEscrowDetailDialog = ({
  setIsDialogOpen,
  setSelectedEscrow,
}: useEscrowDetailDialogProps) => {
  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  };

  return { handleClose };
};

export default useEscrowDetailDialog;
