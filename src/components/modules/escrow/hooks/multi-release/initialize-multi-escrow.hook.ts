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
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { toast } from "sonner";
import { useContactStore } from "@/core/store/data/slices/contacts.slice";
import {
  InitializeMultiReleaseEscrowPayload,
  InitializeMultiReleaseEscrowResponse,
  Roles,
} from "@trustless-work/escrow/types";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import {
  useInitializeEscrow as useInitializeEscrowHook,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { Escrow } from "@/@types/escrow.entity";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useInitializeEscrowSchema } from "../../schema/initialize-escrow.schema";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";

type ExtendedRoles = Roles & {
  issuer: string;
};

export const useInitializeMultiEscrow = () => {
  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
    receiver: false,
  });

  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useGlobalUIBoundedStore((state) => state.resetSteps);
  const setCurrentStep = useEscrowUIBoundedStore(
    (state) => state.setCurrentStep,
  );
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
  const escrowType = useEscrowUIBoundedStore((state) => state.escrowType);
  const { getMultiReleaseFormSchema } = useInitializeEscrowSchema();
  const formSchema = getMultiReleaseFormSchema();

  const { deployEscrow } = useInitializeEscrowHook();
  const { sendTransaction } = useSendTransaction();

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
      platformFee: 0,
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
      platformFee: 5,
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
      milestones: [{ description: "Design the wireframe", amount: 2 }],
    };

    // Set form values
    Object.entries(templateData).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });

    // Explicitly set the trustline field
    form.setValue("trustline.address", usdcTrustline.address);
    form.setValue("trustline.decimals", usdcTrustline.decimals || 10000000);
  };

  const milestones = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "",
  );

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [
      ...currentMilestones,
      { description: "", amount: 0 },
    ];
    form.setValue("milestones", updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    if (!escrowType) {
      toast.error("Please select a escrow type first");
      return;
    }

    setIsLoading(true);

    try {
      const finalPayload: InitializeMultiReleaseEscrowPayload = {
        ...payload,
        receiverMemo: Number(payload.receiverMemo) ?? 0,
        signer: address,
        roles: {
          ...payload.roles,
          issuer: address,
        } as ExtendedRoles,
        milestones: payload.milestones,
      };

      const { unsignedTransaction } = await deployEscrow({
        payload: finalPayload,
        type: "multi-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from deployEscrow response.",
        );
      }

      const signedTxXdr = await signTransaction({
        unsignedTransaction,
        address,
      });

      if (!signedTxXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const response = (await sendTransaction(
        signedTxXdr,
      )) as InitializeMultiReleaseEscrowResponse & { escrow: Escrow };

      if (response.status === "SUCCESS") {
        setIsSuccessDialogOpen(true);
        setRecentEscrow({
          ...response.escrow,
          contractId: response.contractId,
        });
        resetSteps();
        setCurrentStep(1);
        router.push("/dashboard/escrow/my-escrows");
      }
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions = useMemo(() => {
    const options = contacts.map((contact) => ({
      value: contact.address,
      label: contact.name,
    }));

    return [{ value: "", label: "Select a Contact" }, ...options];
  }, [contacts]);

  const trustlineOptions = useMemo(() => {
    const options = trustlines.map((trustline) => ({
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
    userOptions,
    trustlineOptions,
    showSelect,
    toggleField,
    isAnyMilestoneEmpty,
    fillTemplateForm,
  };
};
