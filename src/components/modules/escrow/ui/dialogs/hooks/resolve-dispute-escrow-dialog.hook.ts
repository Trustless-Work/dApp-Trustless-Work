/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoaderStore } from "@/store/utilsStore/store";
import { useGlobalBoundedStore } from "@/core/store/data";
import { resolveDispute } from "../../../services/resolveDispute";
import { ResolveDisputePayload } from "@/@types/escrow.entity";
import { MouseEvent } from "react";
import { getFormSchema } from "../../../schema/resolve-dispute-escrow.schema";
import { toast } from "@/hooks/use-toast";

interface useResolveDisputeEscrowDialogProps {
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
}

const useResolveDisputeEscrowDialogHook = ({
  setIsResolveDisputeDialogOpen,
}: useResolveDisputeEscrowDialogProps) => {
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const formSchema = getFormSchema(selectedEscrow);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientFunds: "",
      serviceProviderFunds: "",
    },
  });

  const onSubmit = async (payload: ResolveDisputePayload) => {
    setIsLoading(true);

    try {
      const data = await resolveDispute({
        contractId: selectedEscrow?.contractId,
        disputeResolver: selectedEscrow?.disputeResolver,
        clientFunds: payload.clientFunds,
        serviceProviderFunds: payload.serviceProviderFunds,
      });

      if (data.status === "SUCCESS" || data.status === 201) {
        form.reset();
        setIsResolveDisputeDialogOpen(false);
        setIsLoading(false);

        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsLoading(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (Number(selectedEscrow?.balance) !== 0) {
      setIsResolveDisputeDialogOpen(true);
    } else {
      toast({
        title: "Error",
        description: "The balance cannot be 0",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsResolveDisputeDialogOpen(false);
  };

  return { onSubmit, form, handleClose, handleOpen };
};

export default useResolveDisputeEscrowDialogHook;
