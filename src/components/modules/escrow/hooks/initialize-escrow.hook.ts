/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useToast } from "@/hooks/use-toast";
import { initializeEscrow } from "@/services/escrow/initializeEscrow";
import { useLoaderStore } from "@/store/utilsStore";
import { useWalletStore } from "@/store/walletStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  client: z.string().min(1, {
    message: "Client is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
  serviceProvider: z.string().min(1, {
    message: "Service provider is required.",
  }),
  platformAddress: z.string().min(1, {
    message: "Platform address is required.",
  }),
  platformFee: z.string().min(1, {
    message: "Platform fee is required.",
  }),
  amount: z.string().min(1, {
    message: "Amount must be greater than 0.",
  }),
  releaseSigner: z.string().min(1, {
    message: "Release signer is required.",
  }),
  disputeResolver: z.string().min(1, {
    message: "Dispute resolver is required.",
  }),
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string().min(1, {
          message: "Milestone status is required.",
        }),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});

export const useInitializeEscrowHook = () => {
  const { address } = useWalletStore();
  const { toast } = useToast();
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      engagementId: "",
      serviceProvider: "",
      platformAddress: "",
      platformFee: "",
      amount: "",
      releaseSigner: "",
      disputeResolver: "",
      milestones: [{ description: "", status: "" }],
    },
  });

  const milestones = form.watch("milestones");

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    form.setValue("milestones", [
      ...currentMilestones,
      { description: "", status: "" },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const payloadSubmit = {
      ...payload,
      releaseSigner: address,
    };

    setIsLoading(true);

    try {
      const data = await initializeEscrow(payloadSubmit);
      if (data.status === "SUCCESS" || data.status === 201) {
        form.reset();
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

  return {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
  };
};
