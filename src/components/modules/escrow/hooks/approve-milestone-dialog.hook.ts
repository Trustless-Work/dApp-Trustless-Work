"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import {
  useApproveMilestone,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  ApproveMilestonePayload,
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow/types";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { Escrow } from "@/@types/escrow.entity";

const useApproveMilestoneDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingFlag = useEscrowUIBoundedStore(
    (state) => state.setIsChangingFlag,
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
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const { approveMilestone } = useApproveMilestone();
  const { sendTransaction } = useSendTransaction();

  const approveMilestoneSubmit = async (
    selectedEscrow: Escrow,
    milestone: MultiReleaseMilestone | SingleReleaseMilestone,
    index: number,
  ) => {
    setIsChangingFlag(true);

    try {
      const finalPayload: ApproveMilestonePayload = {
        contractId: selectedEscrow?.contractId || "",
        milestoneIndex: index.toString(),
        newFlag: true,
        approver: address,
      };

      const { unsignedTransaction } = await approveMilestone({
        payload: finalPayload,
        type: "single-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from approveMilestone response.",
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
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast.success(
          `The Milestone ${milestone.description} has been approved.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsChangingFlag(false);
    }
  };

  return { approveMilestoneSubmit };
};

export default useApproveMilestoneDialog;
