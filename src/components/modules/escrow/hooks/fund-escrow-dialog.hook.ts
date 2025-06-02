/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { trustlessWorkService } from "../services/trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { FundEscrowPayload } from "@/@types/escrows/escrow-payload.entity";
import { toast } from "sonner";

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen?: (value: boolean) => void;
}

const useFundEscrowDialog = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsFundingEscrow = useEscrowUIBoundedStore(
    (state) => state.setIsFundingEscrow,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setAmountMoonpay = useEscrowUIBoundedStore(
    (state) => state.setAmountMoonpay,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "",
    },
    mode: "onChange",
  });

  const amount = form.watch("amount");
  const paymentMethod = form.watch("paymentMethod");
  const setError = form.setError;
  const clearErrors = form.clearErrors;

  useEffect(() => {
    setAmountMoonpay(amount);
  }, [amount, setAmountMoonpay]);

  useEffect(() => {
    if (paymentMethod === "card" && parseInt(amount, 10) < 20) {
      setError("amount", {
        type: "custom",
        message:
          "For card payments by Moonpay, the amount must be at least $20.",
      });
    } else {
      clearErrors("amount");
    }
  }, [paymentMethod, amount, setError, clearErrors]);

  const onSubmit = async (payload: FundEscrowPayload) => {
    setIsFundingEscrow(true);

    try {
      const finalPayload: FundEscrowPayload = {
        signer: address,
        amount: payload.amount,
        contractId: selectedEscrow!.contractId,
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/fund-escrow",
        method: "post",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

      if (response.status === "SUCCESS") {
        form.reset();
        setIsSecondDialogOpen?.(false);
        setIsDialogOpen(false);
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast.success("Escrow funded successfully");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
