/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { trustlessWorkService } from "../../../services/trustless-work.service";
import { StartDisputePayload } from "@/@types/escrows/escrow-payload.entity";
import { toast } from "sonner";

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
      const finalPayload: StartDisputePayload = {
        contractId: selectedEscrow?.contractId,
        signer: address,
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/change-dispute-flag",
        method: "post",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

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

        toast.success(`You have started a dispute in ${selectedEscrow.title}.`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsStartingDispute(false);
    }
  };

  return { startDisputeSubmit };
};

export default useStartDisputeEscrowDialog;
