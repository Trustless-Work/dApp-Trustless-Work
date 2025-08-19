"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import { SingleReleaseStartDisputePayload } from "@trustless-work/escrow";
import { handleError } from "@/errors/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

export const useDisputeEscrowDialog = () => {
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
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const { startDispute } = useEscrowsMutations();

  const startDisputeSubmit = async () => {
    setIsStartingDispute(true);

    if (!selectedEscrow) return;

    try {
      const finalPayload: SingleReleaseStartDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: address,
      };

      await startDispute.mutateAsync({
        payload: finalPayload,
        type: "single-release",
        address,
      });

      setIsDialogOpen(false);
      setSelectedEscrow(undefined);

      toast.success(`You have started a dispute in ${selectedEscrow.title}.`);
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsStartingDispute(false);
    }
  };

  return { startDisputeSubmit };
};
