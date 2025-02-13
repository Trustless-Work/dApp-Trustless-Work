"use client";

import { useGlobalBoundedStore } from "@/core/store/data";

interface useSuccessResolveDisputeDialogProps {
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
}

const useSuccessResolveDisputeDialog = ({
  setIsSuccessResolveDisputeDialogOpen,
}: useSuccessResolveDisputeDialogProps) => {
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const setApproverFunds = useGlobalBoundedStore(
    (state) => state.setApproverFunds,
  );
  const setServiceProviderFunds = useGlobalBoundedStore(
    (state) => state.setServiceProviderFunds,
  );

  const handleClose = () => {
    setIsSuccessResolveDisputeDialogOpen(false);
    setRecentEscrow(undefined);
    setApproverFunds("");
    setServiceProviderFunds("");
  };

  return { handleClose };
};

export default useSuccessResolveDisputeDialog;
