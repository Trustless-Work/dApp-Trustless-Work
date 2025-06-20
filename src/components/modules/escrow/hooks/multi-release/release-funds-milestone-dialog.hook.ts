"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import {
  useReleaseFunds,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { MultiReleaseReleaseFundsPayload } from "@trustless-work/escrow";
import { useEscrowBoundedStore } from "../../store/data";

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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);
  const milestone = selectedEscrow?.milestones[milestoneIndex || 0];

  const { releaseFunds } = useReleaseFunds();
  const { sendTransaction } = useSendTransaction();

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

      const { unsignedTransaction } = await releaseFunds({
        payload: finalPayload,
        type: "multi-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from releaseFunds response.",
        );
      }

      const signedTxXdr = await signTransaction({
        unsignedTransaction,
        address,
      });

      if (!signedTxXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const response = await sendTransaction(signedTxXdr);

      if (response.status === "SUCCESS") {
        setIsSuccessReleaseDialogOpen(true);
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsDialogOpen(false);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast.success(
          `You have released the payment in ${milestone?.description}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsReleasingFunds(false);
      onComplete?.();
    }
  };

  return { releaseFundsSubmit };
};
