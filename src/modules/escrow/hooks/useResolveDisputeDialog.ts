"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalBoundedStore } from "@/store/data";
import { MouseEvent } from "react";
import { getFormSchema } from "../schema/resolve-dispute-escrow.schema";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import { useEscrowDialogs } from "./dialogs/useEscrowDialogs";
import { useEscrowBoundedStore } from "../store/data";
import { AxiosError } from "axios";
import { handleError } from "@/errors/handle-errors";
import { useResolveDisputeSingle } from "./single-release/useResolveDisputeSingle";
import { useResolveDisputeMulti } from "./multi-release/useResolveDisputeMulti";

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
  const setResolvedDistributions = useEscrowUIBoundedStore(
    (state) => state.setResolvedDistributions,
  );

  const dialogStates = useEscrowDialogs();
  const setIsResolveDisputeDialogOpen = dialogStates.resolveDispute.setIsOpen;

  const { onSubmitSingle } = useResolveDisputeSingle();
  const { onSubmitMulti } = useResolveDisputeMulti();

  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distributions: [
        {
          address: selectedEscrow?.roles?.approver || "",
          amount: 0,
        },
        {
          address: selectedEscrow?.roles?.receiver || "",
          amount: 0,
        },
      ],
    },
    mode: "onChange",
  });

  const onSubmit = async (
    {
      distributions,
    }: {
      distributions: { address: string; amount: number | string }[];
    },
    onComplete?: () => void,
  ) => {
    setIsResolvingDispute(true);

    if (!selectedEscrow) return;

    try {
      // Normalize amounts to numbers
      const normalizedDistributions = distributions.map((d) => ({
        address: d.address,
        amount: typeof d.amount === "string" ? Number(d.amount) : d.amount,
      }));

      // Delegate to specific hooks
      const resolvedDists =
        selectedEscrow.type === "multi-release"
          ? await onSubmitMulti(
              normalizedDistributions,
              Number(milestoneIndex || 0),
            )
          : await onSubmitSingle(normalizedDistributions);

      // Update success dialog values based on known roles
      const approverSum = resolvedDists
        .filter((d) => d.address === selectedEscrow.roles.approver)
        .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
      const receiverSum = resolvedDists
        .filter((d) => d.address === selectedEscrow.roles.receiver)
        .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

      setReceiverResolve(receiverSum);
      setApproverResolve(approverSum);
      setResolvedDistributions(
        resolvedDists.map((d) => ({
          address: d.address,
          amount: Number(d.amount) || 0,
        })),
      );

      const totalResolvedAmount = resolvedDists.reduce(
        (acc, d) => acc + (Number(d.amount) || 0),
        0,
      );
      const currentBalance = Number(selectedEscrow.balance || 0);
      const updatedBalance = Math.max(0, currentBalance - totalResolvedAmount);

      form.reset();
      setIsResolveDisputeDialogOpen(false);
      setIsSuccessResolveDisputeDialogOpen(true);

      if (selectedEscrow && milestoneIndex !== null) {
        const updatedEscrow = {
          ...selectedEscrow,
          balance: updatedBalance,
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
        setRecentEscrow(updatedEscrow);
      } else if (selectedEscrow) {
        const updatedEscrow = {
          ...selectedEscrow,
          balance: updatedBalance,
        };
        setRecentEscrow(updatedEscrow);
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
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
