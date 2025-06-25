"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { MouseEvent } from "react";
import { getFormSchema } from "../schema/resolve-dispute-escrow.schema";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import {
  useResolveDispute,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import {
  MultiReleaseResolveDisputePayload,
  SingleReleaseResolveDisputePayload,
} from "@trustless-work/escrow";
import { useEscrowDialogs } from "../ui/dialogs/hooks/use-escrow-dialogs.hook";
import { useEscrowBoundedStore } from "../store/data";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";

export const useResolveDisputeDialog = () => {
  const setIsResolvingDispute = useEscrowUIBoundedStore(
    (state) => state.setIsResolvingDispute,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const setIsSuccessResolveDisputeDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessResolveDisputeDialogOpen,
  );
  const formSchema = getFormSchema();
  const setReceiverResolve = useEscrowUIBoundedStore(
    (state) => state.setReceiverResolve,
  );
  const setApproverResolve = useEscrowUIBoundedStore(
    (state) => state.setApproverResolve,
  );

  const dialogStates = useEscrowDialogs();
  const setIsResolveDisputeDialogOpen = dialogStates.resolveDispute.setIsOpen;

  const { resolveDispute } = useResolveDispute();
  const { sendTransaction } = useSendTransaction();

  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approverFunds: 0,
      receiverFunds: 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (
    {
      approverFunds,
      receiverFunds,
    }: {
      approverFunds: number;
      receiverFunds: number;
    },
    onComplete?: () => void,
  ) => {
    setIsResolvingDispute(true);

    if (!selectedEscrow) return;

    try {
      const finalPayload:
        | SingleReleaseResolveDisputePayload
        | MultiReleaseResolveDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver,
        approverFunds: approverFunds,
        receiverFunds: receiverFunds,
        milestoneIndex:
          selectedEscrow.type === "multi-release"
            ? milestoneIndex?.toString() || ""
            : "",
      };

      const { unsignedTransaction } = await resolveDispute({
        payload: finalPayload,
        type: selectedEscrow.type || "single-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from resolveDispute response.",
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
        form.reset();
        setReceiverResolve(receiverFunds);
        setApproverResolve(approverFunds);
        setIsResolveDisputeDialogOpen(false);
        setIsDialogOpen(false);
        fetchAllEscrows({ address, type: activeTab || "client" });
        setIsSuccessResolveDisputeDialogOpen(true);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast.success("Dispute resolved successfully");
      }
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsResolvingDispute(false);
      onComplete?.();
    }
  };

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (Number(selectedEscrow?.balance) !== 0) {
      setIsResolveDisputeDialogOpen(true);
    } else {
      toast.error("The balance cannot be 0");
    }
  };

  const handleClose = () => {
    setReceiverResolve(0);
    setApproverResolve(0);
    setIsResolveDisputeDialogOpen(false);
  };

  return { onSubmit, form, handleClose, handleOpen };
};
