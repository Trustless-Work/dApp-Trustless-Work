/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { EscrowPayload } from "@/@types/escrow.entity";
import { startDispute } from "../../../services/start-dispute.service";
import { toast } from "@/hooks/toast.hook";

const useStartDisputeEscrowDialog = () => {
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
      const data = await startDispute({
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

      if ((data.status === "SUCCESS" || data.status === 201) && responseFlag) {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        setIsDialogOpen(false);

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

export default useStartDisputeEscrowDialog;
