/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distribute-escrow-earnings.service";
import { toast } from "@/hooks/use-toast";

const useDistributeEarningsEscrowDialogHook = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );

  const distributeEscrowEarningsSubmit = async () => {
    setIsChangingStatus(true);
    setIsSuccessReleaseDialogOpen(false);

    try {
      const data = await distributeEscrowEarnings({
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.serviceProvider,
        releaseSigner: selectedEscrow?.releaseSigner,
      });

      if (data.status === "SUCCESS" || data.status === 201) {
        setIsSuccessReleaseDialogOpen(true);
        setIsDialogOpen(false);
        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }
      }
    } catch (error: any) {
      setIsChangingStatus(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { distributeEscrowEarningsSubmit };
};

export default useDistributeEarningsEscrowDialogHook;
