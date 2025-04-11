/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { startDispute } from "../../../services/start-dispute.service";
import { toast } from "@/hooks/toast.hook";

const useStartDisputeEscrowDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsStartingDispute = useEscrowUIBoundedStore(
    (state) => state.setIsStartingDispute,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
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
        updateEscrow({
          escrowId: selectedEscrow.id,
          payload: {
            ...selectedEscrow,
            disputeStartedBy: activeTab,
          },
        });
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
