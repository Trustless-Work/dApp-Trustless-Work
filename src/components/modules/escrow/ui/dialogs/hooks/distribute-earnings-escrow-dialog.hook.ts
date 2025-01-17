/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useToast } from "@/hooks/use-toast";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distributeEscrowEarnings";

const useDistributeEarningsEscrowDialogHook = () => {
  const { toast } = useToast();
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const distributeEscrowEarningsSubmit = async () => {
    setIsChangingStatus(true);

    try {
      const data = await distributeEscrowEarnings({
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.serviceProvider,
        releaseSigner: selectedEscrow?.releaseSigner,
      });

      console.log(data);

      if (data.status === "SUCCESS" || data.status === 201) {
        toast({
          title: "Success",
          description: data.message,
        });
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
