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
import { FundEscrowPayload } from "@trustless-work/escrow/types";
import {
  useFundEscrow,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";

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
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setAmountMoonpay = useEscrowUIBoundedStore(
    (state) => state.setAmountMoonpay,
  );

  const { fundEscrow } = useFundEscrow();
  const { sendTransaction } = useSendTransaction();

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

  const onSubmit = async ({ amount }: { amount: number }) => {
    setIsFundingEscrow(true);

    try {
      const finalPayload: FundEscrowPayload = {
        signer: address,
        amount: amount,
        contractId: selectedEscrow!.contractId || "",
      };

      const { unsignedTransaction } = await fundEscrow({
        payload: finalPayload,
        type: selectedEscrow?.type || "single-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from fundEscrow response.",
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
        setIsSecondDialogOpen?.(false);
        setIsDialogOpen(false);
        updateEscrow({
          escrowId: selectedEscrow!.id,
          payload: {
            ...selectedEscrow!,
            fundedBy: activeTab,
          },
        });
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast.success("Escrow funded successfully");
      }
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
