/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../../schema/fund-escrow-schema";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/store/utilsStore/store";
import { fundEscrow } from "@/components/modules/escrow/services/fundEscrow";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface useFundEscrowDialogProps {
  setIsSecondDialogOpen: (value: boolean) => void;
}

const useFundEscrowDialogHook = ({
  setIsSecondDialogOpen,
}: useFundEscrowDialogProps) => {
  const { toast } = useToast();
  const { address } = useGlobalAuthenticationStore();
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const data = await fundEscrow({
        issuer: address,
        amount: payload.amount,
      });
      if (data.status === "SUCCESS" || data.status === 201) {
        // ! Validate if the user has the preference in true
        //await addEscrow(payload, address, data.contract_id);
        // ! UPDATE ESCROW IN FIREBASE

        form.reset();
        setIsSecondDialogOpen(false);
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
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
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
