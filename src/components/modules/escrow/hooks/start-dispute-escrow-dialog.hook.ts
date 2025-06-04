"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import { StartDisputePayload } from "@trustless-work/escrow/types";
import {
  useStartDispute,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { signTransaction } from "@/lib/stellar-wallet-kit";

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

  const { startDispute } = useStartDispute();
  const { sendTransaction } = useSendTransaction();

  const startDisputeSubmit = async () => {
    setIsStartingDispute(true);

    if (!selectedEscrow) return;

    try {
      const finalPayload: StartDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: address,
      };

      const { unsignedTransaction } = await startDispute({
        payload: finalPayload,
        type: "single-release",
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
