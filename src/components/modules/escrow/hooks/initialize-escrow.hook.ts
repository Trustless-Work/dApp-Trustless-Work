/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToast } from "@/hooks/use-toast";
import { initializeEscrow } from "@/services/escrow/initializeEscrow";
import { useLoaderStore } from "@/store/utilsStore/store";
import { useEscrowFormStore } from "@/store/escrowFormStore/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { formSchema } from "../schema/initialize-escrow-schema";
import { z } from "zod";

export const useInitializeEscrowHook = () => {
  const { toast } = useToast();
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);
  const { formData, setFormData } = useEscrowFormStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      engagementId: "",
      title: "",
      description: "",
      serviceProvider: "",
      platformAddress: "",
      platformFee: "",
      amount: "",
      releaseSigner: "",
      disputeResolver: "",
      milestones: [{ description: "" }],
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
    const updatedMilestones = [...currentMilestones, { description: "" }];
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
    setFormData(payload);
    setIsLoading(true);

    try {
      const data = await initializeEscrow(payload);
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
