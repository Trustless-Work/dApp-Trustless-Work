/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useToast } from "@/hooks/use-toast";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { Escrow, EscrowPayload, Milestone } from "@/@types/escrow.entity";
import { startDispute } from "../../../services/startDispute";

const useStartDisputeEscrowDialogHook = () => {
  const { toast } = useToast();
  const { address } = useGlobalAuthenticationStore();
  const setIsStartingDispute = useEscrowBoundedStore(
    (state) => state.setIsStartingDispute,
  );
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const startDisputeSubmit = async () => {
    setIsStartingDispute(true);

    if (!selectedEscrow) return;

    try {
      await startDispute({
        contractId: selectedEscrow?.contractId,
        signer: address,
      });

      const updatedPayload: EscrowPayload = {
        ...selectedEscrow,
        disputeFlag: true,
      };

      const responseFlag = await updateEscrow({
        escrowId: selectedEscrow.id,
        payload: updatedPayload,
      });

      setIsStartingDispute(false);

      if (responseFlag) {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);

        toast({
          title: "Success",
          description: `You have started a dispute in ${selectedEscrow.title}.`,
        });
      }
    } catch (error: any) {
      setIsStartingDispute(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { startDisputeSubmit };
};

export default useStartDisputeEscrowDialogHook;
