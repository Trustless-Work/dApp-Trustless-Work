/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToast } from "@/hooks/use-toast";
import { initializeEscrow } from "@/services/escrow/initializeEscrow";
import { useLoaderStore } from "@/store/utilsStore/store";
import { useWalletStore } from "@/store/walletStore/store";
import { useEscrowFormStore } from "@/store/escrowFormStore/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
  const { formData, setFormData } = useEscrowFormStore();

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

  // Load stored form data when component mounts
  useEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((key) => {
        form.setValue(key as any, formData[key as keyof typeof formData]);
      });
    }
  }, [formData, form]);

  const milestones = form.watch("milestones");

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [
      ...currentMilestones,
      { description: "", status: "" },
    ];
    form.setValue("milestones", updatedMilestones);
    setFormData({ milestones: updatedMilestones });
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
    setFormData({ milestones: updatedMilestones });
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const payloadSubmit = {
      ...payload,
      releaseSigner: address,
    };

    // Update store with latest form data before submission
    setFormData(payload);
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

  // Update store whenever form fields change
  const handleFieldChange = (name: string, value: any) => {
    setFormData({ [name]: value });
  };

  return {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleFieldChange,
  };
};
