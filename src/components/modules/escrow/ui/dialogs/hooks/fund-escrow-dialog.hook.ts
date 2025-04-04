/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../../schema/fund-escrow.schema";
import { fundEscrow } from "@/components/modules/escrow/services/fund-escrow.service";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { toast } from "@/hooks/toast.hook";
import { useEffect, useState } from "react";

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen: (value: boolean) => void;
}

const useFundEscrowDialog = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
  const [showMoonpay, setShowMoonpay] = useState(false);

  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsFundingEscrow = useEscrowBoundedStore(
    (state) => state.setIsFundingEscrow,
  );
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

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

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsFundingEscrow(true);

    try {
      const response = await fundEscrow({
        signer: address,
        amount: payload.amount,
        contractId: selectedEscrow!.contractId,
      });

      if (response.status === "SUCCESS" || response.status === 201) {
        form.reset();
        setIsSecondDialogOpen(false);
        setIsFundingEscrow(false);
        setIsDialogOpen(false);
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast({
          title: "Success",
          description: "Escrow funded successfully",
        });
      } else {
        setIsFundingEscrow(false);
        toast({
          title: "Error",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsFundingEscrow(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsSecondDialogOpen(false);
  };

  return {
    onSubmit,
    form,
    handleClose,
    paymentMethod,
    amount,
    showMoonpay,
    setShowMoonpay,
  };
};

export default useFundEscrowDialog;
