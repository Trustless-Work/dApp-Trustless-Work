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
import { SingleReleaseStartDisputePayload } from "@trustless-work/escrow";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";

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
      const finalPayload: SingleReleaseStartDisputePayload = {
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
            flags: {
              ...selectedEscrow.flags,
              disputed: true,
            },
          },
        });
        fetchAllEscrows({ address, type: activeTab || "client" });

        toast.success(`You have started a dispute in ${selectedEscrow.title}.`);
      }
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsStartingDispute(false);
    }
  };

  return { startDisputeSubmit };
};
