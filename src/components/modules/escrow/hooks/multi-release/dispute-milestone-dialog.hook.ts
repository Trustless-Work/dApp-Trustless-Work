"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import {
  MultiReleaseMilestone,
  MultiReleaseStartDisputePayload,
} from "@trustless-work/escrow";
import { Escrow } from "@/@types/escrow.entity";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

export const useDisputeMilestoneDialog = () => {
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

  const { startDispute } = useEscrowsMutations();

  const startDisputeSubmit = async (
    selectedEscrow: Escrow,
    milestone: MultiReleaseMilestone,
    index: number,
    onComplete?: () => void,
  ) => {
    setIsStartingDispute(true);

    if (!selectedEscrow) return;

    try {
      const finalPayload: MultiReleaseStartDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: address,
        milestoneIndex: index.toString() || "0",
      };

      await startDispute.mutateAsync({
        payload: finalPayload,
        type: "multi-release",
        address,
      });

      setSelectedEscrow(undefined);

      toast.success(`You have started a dispute in ${milestone.description}.`);
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsStartingDispute(false);
      onComplete?.();
    }
  };

  return { startDisputeSubmit };
};
