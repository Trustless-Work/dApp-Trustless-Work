/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { GetFormSchema } from "../schema/initialize-escrow.schema";
import { Trustline } from "@/@types/trustline.entity";
import { InitializeEscrowPayload } from "@/@types/escrows/escrow-payload.entity";
import { trustlessWorkService } from "../services/trustless-work.service";
import { InitializeEscrowResponse } from "@/@types/escrows/escrow-response.entity";
import { toast } from "sonner";
import { useContactStore } from "@/core/store/data/slices/contacts.slice";

export const useInitializeEscrow = () => {
  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
    receiver: false,
  });

  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);
  const formData = useEscrowUIBoundedStore((state) => state.formData);
  const setFormData = useEscrowUIBoundedStore((state) => state.setFormData);
  const resetForm = useEscrowUIBoundedStore((state) => state.resetForm);
  const setCurrentStep = useEscrowUIBoundedStore(
    (state) => state.setCurrentStep,
  );
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useGlobalUIBoundedStore((state) => state.resetSteps);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const fetchContacts = useContactStore((state) => state.fetchContacts);
  const contacts = useContactStore((state) => state.contacts);

  const getAllTrustlines = useGlobalBoundedStore(
    (state) => state.getAllTrustlines,
  );
  const address = useGlobalAuthenticationStore((state) => state.address);
  const trustlines = useGlobalBoundedStore((state) => state.trustlines);
  const formSchema = GetFormSchema();

  useEffect(() => {
    if (address) {
      fetchContacts(address);
      getAllTrustlines();
    }
  }, [fetchContacts, getAllTrustlines, address]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engagementId: "",
      title: "",
      description: "",
      platformFee: "",
      amount: "",
      receiverMemo: "",
      trustline: {
        address: "",
        decimals: 10000000,
      },
      roles: {
        approver: "",
        serviceProvider: "",
        platformAddress: "",
        receiver: "",
        releaseSigner: "",
        disputeResolver: "",
      },
      milestones: [{ description: "" }],
    },
    mode: "onChange",
  });

  const fillTemplateForm = () => {
    // Find the USDC trustline
    const usdcTrustline =
      trustlines.find((tl) => tl.name?.toLowerCase().includes("usdc")) ||
      trustlines[0];

    if (!usdcTrustline) {
      toast.error("No trustline available");
      return;
    }

    const templateData: z.infer<typeof formSchema> = {
      engagementId: "ENG-001",
      title: "Design Landing Page",
      description: "Landing for the new product of the company.",
      platformFee: "5",
      amount: "5",
      receiverMemo: "123",
      trustline: {
        address: usdcTrustline.address,
        decimals: usdcTrustline.decimals || 10000000,
      },
      roles: {
        approver: address || "",
        serviceProvider: address || "",
        platformAddress: address || "",
        receiver: address || "",
        releaseSigner: address || "",
        disputeResolver: address || "",
      },
      milestones: [
        { description: "Design the wireframe" },
        { description: "Implementation in React" },
        { description: "Final delivery and review" },
      ],
    };

    // Set form values
    Object.entries(templateData).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });

    // Explicitly set the trustline field
    form.setValue("trustline.address", usdcTrustline.address);
    form.setValue("trustline.decimals", usdcTrustline.decimals || 10000000);

    setFormData(templateData);
  };

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
      const finalPayload: InitializeEscrowPayload = {
        ...payload,
        receiverMemo: Number(payload.receiverMemo) ?? 0,
        signer: address,
        roles: {
          ...payload.roles,
          issuer: address,
        },
      };

      const result = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/deployer/invoke-deployer-contract",
        method: "post",
      })) as InitializeEscrowResponse;

      if (result.status === "SUCCESS") {
        setIsSuccessDialogOpen(true);
        setRecentEscrow({ ...result.escrow, contractId: result.contractId });
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
        toast.error(result.message || "An error occurred");
      }
    } catch (err) {
      setIsLoading(false);
      setIsSuccessDialogOpen(false);
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  };

  // Update store whenever form fields change
  const handleFieldChange = (name: string, value: any) => {
    setFormData({ [name]: value });
  };

  const userOptions = useMemo(() => {
    const options = contacts.map((contact) => ({
      value: contact.address,
      label: `${contact.firstName} ${contact.lastName}`,
    }));

    return [{ value: "", label: "Select a Contact" }, ...options];
  }, [contacts]);

  const trustlineOptions = useMemo(() => {
    const options = trustlines.map((trustline: Trustline) => ({
      value: trustline.address,
      label: trustline.name,
    }));

    return [{ value: "", label: "Select a Trustline" }, ...options];
  }, [trustlines]);

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
    trustlineOptions,
    showSelect,
    toggleField,
    isAnyMilestoneEmpty,
    fillTemplateForm,
  };
};
