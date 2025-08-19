"use client";

interface useQREscrowDialogProps {
  setIsQRDialogOpen: (value: boolean) => void;
}

const useQREscrowDialog = ({ setIsQRDialogOpen }: useQREscrowDialogProps) => {
  const handleClose = () => {
    setIsQRDialogOpen(false);
  };

  return { handleClose };
};

export default useQREscrowDialog;
