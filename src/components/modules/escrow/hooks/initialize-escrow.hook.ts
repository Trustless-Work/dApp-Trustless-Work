/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "@/hooks/toast.hook";
import { initializeEscrow } from "@/components/modules/escrow/services/initialize-escrow.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../store/ui";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { GetFormSchema } from "../schema/initialize-escrow.schema";

export const useInitializeEscrow = () => {
  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
  });

  const { address } = useGlobalAuthenticationStore();
  const addEscrow = useGlobalBoundedStore((state) => state.addEscrow);
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);
  const formData = useEscrowBoundedStore((state) => state.formData);
  const setFormData = useEscrowBoundedStore((state) => state.setFormData);
  const resetForm = useEscrowBoundedStore((state) => state.resetForm);
  const setCurrentStep = useEscrowBoundedStore((state) => state.setCurrentStep);
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useGlobalUIBoundedStore((state) => state.resetSteps);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const getAllUsers = useGlobalAuthenticationStore(
    (state) => state.getAllUsers,
  );
  const users = useGlobalAuthenticationStore((state) => state.users);
  const getAllTokens = useGlobalBoundedStore((state) => state.getAllTokens);
  const tokens = useGlobalBoundedStore((state) => state.tokens);
  const formSchema = GetFormSchema();

  useEffect(() => {
    getAllUsers();
    getAllTokens();
  }, [getAllUsers, getAllTokens]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      approver: "",
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
    mode: "onChange",
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
  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "",
  );

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
      const platformFeeDecimal = Number(payload.platformFee);

      const data = await initializeEscrow(
        {
          ...payload,
          platformFee: platformFeeDecimal.toString(),
          issuer: address,
        },
        address,
      );

      if (data.status === "SUCCESS" || data.status === 201) {
        setIsSuccessDialogOpen(true);

        if (loggedUser?.saveEscrow) {
          // todo: aqui cuando el contracto me devuelva el token, entonces automaticamente se le pasa al firebase y lo estaria guardando
          await addEscrow(
            { ...data.escrow, platformFee: platformFeeDecimal.toString() },
            address,
            data.contract_id,
          );
        }

        setRecentEscrow({ ...data.escrow, contractId: data.contract_id });
        resetSteps();
        setCurrentStep(1);
        form.reset();
        resetForm();
        router.push("/dashboard/escrow/my-escrows");
        setIsLoading(false);
      } else {
        resetSteps();
        setCurrentStep(1);
        setIsLoading(false);
        setIsSuccessDialogOpen(false);
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      setIsSuccessDialogOpen(false);

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

  const userOptions = useMemo(() => {
    const options = users.map((user) => ({
      value: user.address,
      label: `${user.firstName} ${user.lastName}`,
    }));

    return [{ value: "", label: "Select an User" }, ...options];
  }, [users]);

  const tokenOptions = useMemo(() => {
    const options = tokens.map((token) => ({
      value: token.token,
      label: token.name,
    }));

    return [{ value: "", label: "Select a Token" }, ...options];
  }, [tokens]);

  const toggleField = (field: string, value: boolean) => {
    setShowSelect((prev) => ({ ...prev, [field]: value }));
  };

  return {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleFieldChange,
    userOptions,
    tokenOptions,
    showSelect,
    toggleField,
    isAnyMilestoneEmpty,
  };
};
