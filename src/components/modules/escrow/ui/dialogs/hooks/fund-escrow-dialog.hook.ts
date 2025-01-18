/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../../schema/fund-escrow-schema";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/store/utilsStore/store";
import { fundEscrow } from "@/components/modules/escrow/services/fundEscrow";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen: (value: boolean) => void;
}

const useFundEscrowDialogHook = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
  const { toast } = useToast();
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsFundingEscrow = useEscrowBoundedStore(
    (state) => state.setIsFundingEscrow,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsFundingEscrow(true);

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

export default useFundEscrowDialogHook;
