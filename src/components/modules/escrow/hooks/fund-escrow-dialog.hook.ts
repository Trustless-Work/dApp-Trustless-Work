"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/fund-escrow.schema";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { useEffect } from "react";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen?: (value: boolean) => void;
}

const useFundEscrowDialog = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const setIsFundingEscrow = useEscrowUIBoundedStore(
    (state) => state.setIsFundingEscrow,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setAmountMoonpay = useEscrowUIBoundedStore(
    (state) => state.setAmountMoonpay,
  );

  const { fundEscrow } = useEscrowsMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "wallet",
    },
    mode: "onChange",
  });

  const amount = form.watch("amount");
  const paymentMethod = form.watch("paymentMethod");
  const setError = form.setError;
  const clearErrors = form.clearErrors;

  useEffect(() => {
    setAmountMoonpay(amount || 0);
  }, [amount, setAmountMoonpay]);

  useEffect(() => {
    if (paymentMethod === "card" && amount < 20) {
      setError("amount", {
        type: "custom",
        message:
          "For card payments by Moonpay, the amount must be at least $20.",
      });
    } else {
      clearErrors("amount");
    }
  }, [paymentMethod, amount, setError, clearErrors]);

  if (!selectedEscrow) {
    return {
      onSubmit: async () => {},
      form,
      handleClose: () => {},
      paymentMethod,
      amount,
      setIsDialogOpen,
    };
  }

  const onSubmit = async ({ amount }: { amount: number }) => {
    setIsFundingEscrow(true);

    try {
      await fundEscrow.mutateAsync({
        payload: {
          signer: address,
          amount: amount,
          contractId: selectedEscrow!.contractId || "",
        },
        type: selectedEscrow?.type || "single-release",
        address,
      });

      form.reset();
      setIsSecondDialogOpen?.(false);
      setSelectedEscrow({
        ...selectedEscrow,
        balance: (selectedEscrow?.balance || 0) + amount,
      });
      toast.success("Escrow funded successfully");
    } catch (err) {
      console.log(err);
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsFundingEscrow(false);
    }
  };

  const handleClose = () => {
    setIsSecondDialogOpen?.(false);
  };

  return {
    onSubmit,
    form,
    handleClose,
    paymentMethod,
    amount,
    setIsDialogOpen,
  };
};

export default useFundEscrowDialog;
