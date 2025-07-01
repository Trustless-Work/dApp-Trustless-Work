"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import { MultiReleaseReleaseFundsPayload } from "@trustless-work/escrow";
import { useEscrowBoundedStore } from "../../store/data";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

export const useReleaseFundsMilestoneDialog = () => {
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
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);
  const milestone = selectedEscrow?.milestones[milestoneIndex || 0];

  const { releaseFunds } = useEscrowsMutations();

  const releaseFundsSubmit = async (onComplete?: () => void) => {
    setIsReleasingFunds(true);
    setIsSuccessReleaseDialogOpen(false);

    if (!selectedEscrow) return;

    try {
      const finalPayload: MultiReleaseReleaseFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: address,
        releaseSigner: selectedEscrow?.roles?.releaseSigner,
        milestoneIndex: milestoneIndex?.toString() || "0",
      };

      await releaseFunds.mutateAsync({
        payload: finalPayload,
        type: "multi-release",
        address,
      });

      setIsSuccessReleaseDialogOpen(true);
      setIsDialogOpen(false);

      if (selectedEscrow) {
        setRecentEscrow(selectedEscrow);
      }

      toast.success(
        `You have released the payment in ${milestone?.description}.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsReleasingFunds(false);
      onComplete?.();
    }
  };

  return { releaseFundsSubmit };
};
