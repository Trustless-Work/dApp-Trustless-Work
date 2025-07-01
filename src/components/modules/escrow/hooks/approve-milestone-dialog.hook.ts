"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import { useSendTransaction } from "@trustless-work/escrow/hooks";
import {
  ApproveMilestonePayload,
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow/types";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { Escrow } from "@/@types/escrow.entity";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

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

  const { approveMilestone } = useEscrowsMutations();
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

      const { unsignedTransaction } = await approveMilestone.mutateAsync({
        payload: finalPayload,
        type: selectedEscrow.type,
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

        if (selectedEscrow && index !== null) {
          const updatedEscrow = {
            ...selectedEscrow,
            milestones: selectedEscrow.milestones.map(
              (milestone, milestoneIndex) =>
                milestoneIndex === index
                  ? {
                      ...milestone,
                      ...("flags" in milestone
                        ? { flags: { ...milestone.flags, approved: true } }
                        : { approved: true }),
                    }
                  : milestone,
            ),
          };
          setSelectedEscrow(updatedEscrow);
        }

        toast.success(
          `The Milestone ${milestone.description} has been approved.`,
        );
      }
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsChangingFlag(false);
    }
  };

  return { approveMilestoneSubmit };
};

export default useApproveMilestoneDialog;
