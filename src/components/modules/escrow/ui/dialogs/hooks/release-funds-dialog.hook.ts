/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { trustlessWorkService } from "../../../services/trustless-work.service";
import { ReleaseFundsEscrowPayload } from "@/@types/escrows/escrow-payload.entity";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { toast } from "sonner";

const useReleaseFundsEscrowDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsReleasingFunds = useEscrowUIBoundedStore(
    (state) => state.setIsReleasingFunds,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const releaseFundsSubmit = async () => {
    setIsReleasingFunds(true);
    setIsSuccessReleaseDialogOpen(false);

    if (!selectedEscrow) return;

    try {
      const finalPayload: ReleaseFundsEscrowPayload = {
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.roles?.serviceProvider,
        releaseSigner: selectedEscrow?.roles?.releaseSigner,
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/release-funds",
        method: "post",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

      if (response.status === "SUCCESS") {
        setIsSuccessReleaseDialogOpen(true);
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsDialogOpen(false);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast.success(
          `You have released the payment in ${selectedEscrow.title}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsReleasingFunds(false);
    }
  };

  return { releaseFundsSubmit };
};

export default useReleaseFundsEscrowDialog;
