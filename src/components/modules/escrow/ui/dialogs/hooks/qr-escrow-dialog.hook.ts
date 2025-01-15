"use client";

interface useQREscrowDialogProps {
  setIsQRDialogOpen: (value: boolean) => void;
}

const useQREscrowDialogHook = ({
  setIsQRDialogOpen,
}: useQREscrowDialogProps) => {
  const handleClose = () => {
    setIsQRDialogOpen(false);
  };

  return { handleClose };
};

export default useQREscrowDialogHook;
