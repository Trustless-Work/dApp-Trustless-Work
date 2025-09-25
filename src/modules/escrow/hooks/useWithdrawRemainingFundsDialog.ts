"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { MouseEvent } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { handleError } from "@/errors/handle-errors";
import { useEscrowUIBoundedStore } from "../store/ui";
import { useEscrowDialogs } from "./dialogs/useEscrowDialogs";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";
import { getFormSchema } from "../schema/resolve-dispute-escrow.schema";
import { WithdrawRemainingFundsPayload } from "@trustless-work/escrow";

export const useWithdrawRemainingFundsDialog = () => {
  const setIsWithdrawing = useEscrowUIBoundedStore(
    (state) => state.setIsWithdrawingRemainingFunds,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );

  const { address } = useGlobalAuthenticationStore();
  const dialogStates = useEscrowDialogs();
  const setIsWithdrawDialogOpen = dialogStates.withdrawRemainingFunds.setIsOpen;

  const { withdrawRemainingFunds } = useEscrowsMutations();

  const formSchema = getFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distributions: [
        {
          address: selectedEscrow?.roles?.receiver || "",
          amount: selectedEscrow ? Number(selectedEscrow.balance || 0) : 0,
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
    setIsWithdrawing(true);

    if (!selectedEscrow) return;

    try {
      // Normalize amounts to numbers
      const normalizedDistributions = distributions.map((d) => ({
        address: d.address,
        amount: typeof d.amount === "string" ? Number(d.amount) : d.amount,
      }));

      if (selectedEscrow.type !== "multi-release") {
        throw new Error(
          "Withdraw remaining funds only supported for multi-release escrows.",
        );
      }

      const payload: WithdrawRemainingFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        disputeResolver: address || "",
        distributions: normalizedDistributions as [
          { address: string; amount: number },
        ],
      };

      await withdrawRemainingFunds.mutateAsync({
        payload,
        address,
      });

      form.reset();
      setIsWithdrawDialogOpen(false);

      // Keep detail dialog open to show updated state
      if (selectedEscrow) {
        setRecentEscrow(selectedEscrow);
      }

      toast.success("Remaining funds withdrawn successfully");
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsWithdrawing(false);
      onComplete?.();
    }
  };

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (Number(selectedEscrow?.balance) > 0) {
      setIsWithdrawDialogOpen(true);
    } else {
      toast.error("The balance cannot be 0");
    }
  };

  const handleClose = () => {
    setIsWithdrawDialogOpen(false);
  };

  return { onSubmit, form, handleClose, handleOpen };
};
