/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToast } from "@/hooks/use-toast";
import { initializeEscrow } from "@/components/modules/escrow/services/initializeEscrow";
import { useLoaderStore } from "@/store/utilsStore/store";
import { useEscrowFormStore } from "@/store/escrowFormStore/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { formSchema } from "../schema/initialize-escrow-schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../store/ui";
import { useStepsStore } from "@/store/stepsStore/store";

export const useInitializeEscrowHook = () => {
  const { address } = useGlobalAuthenticationStore();
  const addEscrow = useGlobalBoundedStore((state) => state.addEscrow);
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const { toast } = useToast();
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);
  const { formData, setFormData, resetForm } = useEscrowFormStore();
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useStepsStore((state) => state.resetSteps);
  const setRecentEscrowId = useGlobalBoundedStore(
    (state) => state.setRecentEscrowId,
  );

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
    setIsSuccessDialogOpen(false);

    try {
      const data = await initializeEscrow(
        { ...payload, issuer: address },
        address,
      );
      if (data.status === "SUCCESS" || data.status === 201) {
        setIsSuccessDialogOpen(true);
        if (loggedUser?.saveEscrow) {
          await addEscrow(data.escrow, address, data.contract_id);
        }

        setRecentEscrowId(data.contract_id);
        resetSteps();
        form.reset();
        resetForm();
        router.push("/dashboard/escrow/my-escrows");
        setIsLoading(false);
      } else {
        resetSteps();
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
