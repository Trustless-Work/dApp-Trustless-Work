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
import { getWithdrawRemainingFundsSchema } from "../schema/withdraw-remaining-funds.schema";
import { WithdrawRemainingFundsPayload } from "@trustless-work/escrow";

export const useWithdrawRemainingFundsDialog = () => {
  const setIsWithdrawing = useEscrowUIBoundedStore(
    (state) => state.setIsWithdrawingRemainingFunds,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const { address } = useGlobalAuthenticationStore();
  const dialogStates = useEscrowDialogs();
  const setIsWithdrawDialogOpen = dialogStates.withdrawRemainingFunds.setIsOpen;

  const { withdrawRemainingFunds } = useEscrowsMutations();

  const formSchema = getWithdrawRemainingFundsSchema();

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

  const onSubmit = async (data: {
    distributions: { address: string; amount: number | string }[];
  }) => {
    const { distributions } = data;
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

      // Calcular la suma total de las distribuciones
      const totalWithdrawn = normalizedDistributions.reduce(
        (sum, distribution) => sum + distribution.amount,
        0,
      );

      // Actualizar el balance del escrow
      if (selectedEscrow) {
        const currentBalance = Number(selectedEscrow.balance || 0);
        const updatedBalance = Math.max(0, currentBalance - totalWithdrawn);

        const updatedEscrow = {
          ...selectedEscrow,
          balance: updatedBalance,
        };

        setSelectedEscrow(updatedEscrow);
      }

      form.reset();
      setIsWithdrawDialogOpen(false);

      toast.success("Remaining funds withdrawn successfully");
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsWithdrawing(false);
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
