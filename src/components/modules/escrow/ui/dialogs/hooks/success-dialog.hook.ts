"use client";

import { useGlobalBoundedStore } from "@/core/store/data";

interface useSuccessDialogProps {
  setIsSuccessDialogOpen: (value: boolean) => void;
}

const useSuccessDialog = ({
  setIsSuccessDialogOpen,
}: useSuccessDialogProps) => {
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );

  const handleClose = () => {
    setIsSuccessDialogOpen(false);
    setRecentEscrow(undefined);
  };

  return { handleClose };
};

export default useSuccessDialog;
