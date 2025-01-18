"use client";

import { useGlobalBoundedStore } from "@/core/store/data";

interface useSuccessDialogProps {
  setIsSuccessDialogOpen: (value: boolean) => void;
}

const useSuccessDialogHook = ({
  setIsSuccessDialogOpen,
}: useSuccessDialogProps) => {
  const setRecentEscrowId = useGlobalBoundedStore(
    (state) => state.setRecentEscrowId,
  );

  const handleClose = () => {
    setIsSuccessDialogOpen(false);
    setRecentEscrowId(undefined);
  };

  return { handleClose };
};

export default useSuccessDialogHook;
