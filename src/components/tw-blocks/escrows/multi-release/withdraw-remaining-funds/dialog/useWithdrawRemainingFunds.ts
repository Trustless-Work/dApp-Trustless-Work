import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  withdrawRemainingFundsSchema,
  type WithdrawRemainingFundsValues,
} from "./schema";
import { toast } from "sonner";
import { WithdrawRemainingFundsPayload } from "@trustless-work/escrow";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";

type DistributionInput = { address: string; amount: string | number };

export function useWithdrawRemainingFunds() {
  const { withdrawRemainingFunds } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();

  const form = useForm<WithdrawRemainingFundsValues>({
    resolver: zodResolver(withdrawRemainingFundsSchema),
    defaultValues: {
      distributions: [
        { address: "", amount: "" },
        { address: "", amount: "" },
      ],
    },
    mode: "onChange",
  });

  const distributions = form.watch("distributions") as DistributionInput[];

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allowedAmount = React.useMemo(() => {
    return Number(selectedEscrow?.balance || 0);
  }, [selectedEscrow]);

  const distributedSum = React.useMemo(() => {
    return (distributions || []).reduce((acc, d) => {
      const n = Number(d?.amount ?? 0);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
  }, [distributions]);

  const isExactMatch = React.useMemo(() => {
    return Number(allowedAmount) === Number(distributedSum);
  }, [allowedAmount, distributedSum]);

  const difference = React.useMemo(() => {
    return Math.abs(Number(allowedAmount) - Number(distributedSum));
  }, [allowedAmount, distributedSum]);

  const handleDistributionAddressChange = (index: number, value: string) => {
    const updated = [...distributions];
    updated[index] = { ...updated[index], address: value };
    form.setValue("distributions", updated);
  };

  const handleDistributionAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");
    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }
    const updated = [...distributions];
    updated[index] = { ...updated[index], amount: rawValue };
    form.setValue("distributions", updated);
  };

  const handleAddDistribution = () => {
    const updated = [...distributions, { address: "", amount: "" }];
    form.setValue("distributions", updated);
  };

  const handleRemoveDistribution = (index: number) => {
    if (distributions.length <= 2) return;
    const updated = distributions.filter((_, i) => i !== index);
    form.setValue("distributions", updated);
  };

  const isAnyDistributionEmpty = React.useMemo(() => {
    if (!distributions.length) return true;
    const last = distributions[distributions.length - 1];
    return (last.address || "").trim() === "" || (last.amount ?? "") === "";
  }, [distributions]);

  const handleSubmit = form.handleSubmit(async (payload) => {
    try {
      setIsSubmitting(true);

      if (!isExactMatch) {
        toast.error("The total distributions must equal the remaining amount");
        return;
      }

      const finalPayload: WithdrawRemainingFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        disputeResolver: walletAddress || "",
        distributions: payload.distributions.map((d) => ({
          address: d.address,
          amount: Number(d.amount || 0),
        })) as [{ address: string; amount: number }],
      };

      await withdrawRemainingFunds.mutateAsync({
        payload: finalPayload,
        address: walletAddress || "",
      });

      toast.success("Withdraw successful");

      const sumDistributed = payload.distributions.reduce((acc, d) => {
        const n = Number(d.amount || 0);
        return acc + (isNaN(n) ? 0 : n);
      }, 0);

      updateEscrow({
        ...selectedEscrow,
        balance: (selectedEscrow?.balance || 0) - sumDistributed || 0,
      });
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting,
    distributions,
    handleAddDistribution,
    handleRemoveDistribution,
    handleDistributionAddressChange,
    handleDistributionAmountChange,
    isAnyDistributionEmpty,
    allowedAmount,
    distributedSum,
    isExactMatch,
    difference,
  };
}
