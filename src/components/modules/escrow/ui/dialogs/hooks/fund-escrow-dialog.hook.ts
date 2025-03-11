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

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen: (value: boolean) => void;
}

const useFundEscrowDialog = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
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

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsFundingEscrow(true);

    if (payload.paymentMethod === "card") {
      payByMoonpay(payload);
    } else {
      payByWallet(payload);
    }
  };

  const payByMoonpay = async (payload: z.infer<typeof formSchema>) => {
    const deployedMoonPayUrl = `https://buy-sandbox.moonpay.com/?apiKey=${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}&theme=dark&defaultCurrencyCode=eth&baseCurrencyAmount=${payload.amount}&colorCode=%237d01ff`;

    if (typeof window === "undefined") return;

    const params = new URLSearchParams({
      contractId: selectedEscrow?.contractId || "",
      amount: payload.amount,
      engagementId: selectedEscrow?.engagementId || "",
      callbackUrl: `${window.location.origin}/api/moonpay-callback`,
    });

    const fullUrl = `${deployedMoonPayUrl}&${params.toString()}`;

    window.open(
      fullUrl,
      "moonpayPopup",
      "width=500,height=600,scrollbars=yes,resizable=yes",
    );
  };

  const payByWallet = async (payload: z.infer<typeof formSchema>) => {
    try {
      const data = await fundEscrow({
        signer: address,
        amount: payload.amount,
        contractId: selectedEscrow!.contractId,
      });
      if (data.status === "SUCCESS" || data.status === 201) {
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
          description: data.message || "An error occurred",
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

  return { onSubmit, form, handleClose };
};

export default useFundEscrowDialog;
