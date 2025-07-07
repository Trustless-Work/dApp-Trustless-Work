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
  MultiReleaseResolveDisputePayload,
  SingleReleaseResolveDisputePayload,
} from "@trustless-work/escrow";
import { useEscrowDialogs } from "../ui/dialogs/hooks/use-escrow-dialogs.hook";
import { useEscrowBoundedStore } from "../store/data";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

export const useResolveDisputeDialog = () => {
  const setIsResolvingDispute = useEscrowUIBoundedStore(
    (state) => state.setIsResolvingDispute,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
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

  const { resolveDispute } = useEscrowsMutations();

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
      approverFunds: number | string;
      receiverFunds: number | string;
    },
    onComplete?: () => void,
  ) => {
    setIsResolvingDispute(true);

    if (!selectedEscrow) return;

    try {
      // Convert string values to numbers
      const numericApproverFunds =
        typeof approverFunds === "string"
          ? Number(approverFunds)
          : approverFunds;
      const numericReceiverFunds =
        typeof receiverFunds === "string"
          ? Number(receiverFunds)
          : receiverFunds;

      const finalPayload:
        | SingleReleaseResolveDisputePayload
        | MultiReleaseResolveDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver,
        approverFunds: numericApproverFunds,
        receiverFunds: numericReceiverFunds,
        milestoneIndex:
          selectedEscrow.type === "multi-release"
            ? milestoneIndex?.toString() || ""
            : "",
      };

      await resolveDispute.mutateAsync({
        payload: finalPayload,
        type: selectedEscrow.type || "single-release",
        address,
      });

      form.reset();
      setReceiverResolve(numericReceiverFunds);
      setApproverResolve(numericApproverFunds);
      setIsResolveDisputeDialogOpen(false);
      setIsSuccessResolveDisputeDialogOpen(true);

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
                    flags: {
                      ...milestone.flags,
                      resolved: true,
                      disputed: false,
                    },
                  }),
                }
              : milestone,
          ),
        };
        setSelectedEscrow(updatedEscrow);
      } else {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
      }

      toast.success("Dispute resolved successfully");
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
