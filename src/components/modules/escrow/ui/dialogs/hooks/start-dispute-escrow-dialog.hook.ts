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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const startDisputeSubmit = async () => {
    setIsStartingDispute(true);

    if (!selectedEscrow) return;

    try {
      const response = await startDispute({
        contractId: selectedEscrow?.contractId,
        signer: address,
      });

      setIsStartingDispute(false);

      if (response.status === "SUCCESS") {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "client" });

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
