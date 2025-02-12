/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useToast } from "@/hooks/toast.hook";
import { processPaymentCallback } from "../services/moonpay.service";

export const useMoonPay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePaymentCallback = async (data: any) => {
    setIsProcessing(true);
    try {
      await processPaymentCallback(data);
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process payment, ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handlePaymentCallback,
  };
};
