"use client";

import { useGlobalBoundedStore } from "@/store/data";

interface useSuccessResolveDisputeDialogProps {
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
}

const useSuccessResolveDisputeDialog = ({
  setIsSuccessResolveDisputeDialogOpen,
}: useSuccessResolveDisputeDialogProps) => {
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );

  const handleClose = () => {
    setIsSuccessResolveDisputeDialogOpen(false);
    setRecentEscrow(undefined);
  };

  return { handleClose };
};

export default useSuccessResolveDisputeDialog;
