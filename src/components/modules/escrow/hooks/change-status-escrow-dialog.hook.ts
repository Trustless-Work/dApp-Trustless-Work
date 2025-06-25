"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { formSchema } from "../schema/complete-milestone.schema";
import { useEscrowBoundedStore } from "../store/data";
import { toast } from "sonner";
import {
  useChangeMilestoneStatus,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { ChangeMilestoneStatusPayload } from "@trustless-work/escrow/types";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";

interface changeMilestoneStatusDialogHook {
  setIsCompleteMilestoneDialogOpen: (value: boolean) => void;
}

const useChangeMilestoneStatusDialogHook = ({
  setIsCompleteMilestoneDialogOpen,
}: changeMilestoneStatusDialogHook) => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowUIBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const completingMilestone = useEscrowBoundedStore(
    (state) => state.completingMilestone,
  );
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEvidence: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (newEvidence: string | undefined) => {
    setIsChangingStatus(true);

    try {
      const finalPayload: ChangeMilestoneStatusPayload = {
        contractId: selectedEscrow?.contractId || "",
        milestoneIndex: milestoneIndex?.toString() || "0",
        newStatus: "completed",
        serviceProvider: address,
        newEvidence: newEvidence || "",
      };

      const { unsignedTransaction } = await changeMilestoneStatus({
        payload: finalPayload,
        type: selectedEscrow?.type || "single-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from changeMilestoneStatus response.",
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
        setIsChangingStatus(false);
        setIsDialogOpen(false);
        setIsCompleteMilestoneDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "serviceProvider" });

        toast.success(
          `The Milestone ${completingMilestone?.description} has been completed.`,
        );
      }
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleClose = () => {
    setIsCompleteMilestoneDialogOpen?.(false);
  };

  return {
    form,
    onSubmit,
    handleClose,
    setIsDialogOpen,
  };
};

export default useChangeMilestoneStatusDialogHook;
