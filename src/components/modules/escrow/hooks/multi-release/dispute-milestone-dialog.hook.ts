"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import {
  useStartDispute,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import {
  MultiReleaseMilestone,
  MultiReleaseStartDisputePayload,
} from "@trustless-work/escrow";
import { Escrow } from "@/@types/escrow.entity";

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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const { startDispute } = useStartDispute();
  const { sendTransaction } = useSendTransaction();

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

      const { unsignedTransaction } = await startDispute({
        payload: finalPayload,
        type: "multi-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from startDispute response.",
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
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        updateEscrow({
          escrowId: selectedEscrow.id,
          payload: {
            ...selectedEscrow,
            milestones: selectedEscrow.milestones.map((m, i) =>
              i === index && "flags" in m && m.flags
                ? {
                    ...m,
                    disputeStartedBy: activeTab,
                    flags: { ...m.flags, disputed: true },
                  }
                : m,
            ),
          },
        });
        fetchAllEscrows({ address, type: activeTab || "client" });

        toast.success(
          `You have started a dispute in ${milestone.description}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsStartingDispute(false);
      onComplete?.();
    }
  };

  return { startDisputeSubmit };
};
