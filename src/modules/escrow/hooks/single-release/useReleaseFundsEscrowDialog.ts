"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import { SingleReleaseReleaseFundsPayload } from "@trustless-work/escrow";
import { AxiosError } from "axios";
import { handleError } from "@/errors/handle-errors";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

export const useReleaseFundsEscrowDialog = () => {
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

  const { releaseFunds } = useEscrowsMutations();

  const releaseFundsSubmit = async () => {
    setIsReleasingFunds(true);
    setIsSuccessReleaseDialogOpen(false);

    if (!selectedEscrow) return;

    try {
      const finalPayload: SingleReleaseReleaseFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        releaseSigner: selectedEscrow?.roles?.releaseSigner,
      };

      await releaseFunds.mutateAsync({
        payload: finalPayload,
        type: "single-release",
        address,
      });

      setIsSuccessReleaseDialogOpen(true);
      setIsDialogOpen(false);

      if (selectedEscrow) {
        setRecentEscrow(selectedEscrow);
      }

      toast.success(
        `You have released the payment in ${selectedEscrow.title}.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsReleasingFunds(false);
    }
  };

  return { releaseFundsSubmit };
};
