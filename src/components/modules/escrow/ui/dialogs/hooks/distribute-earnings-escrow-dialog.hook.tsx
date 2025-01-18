/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useToast } from "@/hooks/use-toast";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distributeEscrowEarnings";
import SuccessDialog from "../SuccessDialog";

const useDistributeEarningsEscrowDialogHook = () => {
  const { toast } = useToast();
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.isSuccessDialogOpen,
  );
  const setIsSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );

  const distributeEscrowEarningsSubmit = async () => {
    setIsChangingStatus(true);

    try {
      const data = await distributeEscrowEarnings({
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.serviceProvider,
        releaseSigner: selectedEscrow?.releaseSigner,
      });

      if (data.status === "SUCCESS" || data.status === 201) {
        <SuccessDialog
          isSuccessDialogOpen={isSuccessDialogOpen}
          setIsSuccessDialogOpen={setIsSuccessDialogOpen}
          title="Earnings distributed successfully."
          description="The earnings have been distributed successfully."
        />;
      } else {
        setIsChangingStatus(false);
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
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
