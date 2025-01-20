"use client";

import { useGlobalBoundedStore } from "@/core/store/data";

interface useSuccessReleaseDialogProps {
  setIsSuccessReleaseDialogOpen: (value: boolean) => void;
}

const useSuccessReleaseDialogHook = ({
  setIsSuccessReleaseDialogOpen,
}: useSuccessReleaseDialogProps) => {
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );

  const handleClose = () => {
    setIsSuccessReleaseDialogOpen(false);
    setRecentEscrow(undefined);
  };

  return { handleClose };
};

export default useSuccessReleaseDialogHook;
