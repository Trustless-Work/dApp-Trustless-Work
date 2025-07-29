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
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
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
        releaseSigner: selectedEscrow?.roles?.releaseSigner,
        milestoneIndex: milestoneIndex?.toString() || "0",
      };

      await releaseFunds.mutateAsync({
        payload: finalPayload,
        type: "multi-release",
        address,
      });

      setIsSuccessReleaseDialogOpen(true);

      if (selectedEscrow) {
        setRecentEscrow(selectedEscrow);
      }

      if (selectedEscrow && milestoneIndex !== null) {
        const updatedEscrow = {
          ...selectedEscrow,
          milestones: selectedEscrow.milestones.map((milestone, i) =>
            i === milestoneIndex
              ? {
                  ...milestone,
                  ...("flags" in milestone && {
                    flags: { ...milestone.flags, released: true },
                  }),
                }
              : milestone,
          ),
        };
        setSelectedEscrow(updatedEscrow);
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
