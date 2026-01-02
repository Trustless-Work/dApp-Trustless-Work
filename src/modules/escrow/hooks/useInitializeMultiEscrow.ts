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
} from "@/store/data";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { toast } from "sonner";
import {
  InitializeMultiReleaseEscrowPayload,
  InitializeMultiReleaseEscrowResponse,
} from "@trustless-work/escrow/types";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { useEscrowUIBoundedStore } from "../store/ui";
import { useInitializeEscrowSchema } from "../schema/initialize-escrow.schema";
import { AxiosError } from "axios";
import { trustlines } from "@/constants/trustlines.constant";
import useNetwork from "@/hooks/useNetwork";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import { handleError } from "@/components/tw-blocks/handle-errors/handle";

export const useInitializeMultiEscrow = () => {
  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
    receiver: false,
  });

  const setIsInitializingEscrow = useEscrowUIBoundedStore(
    (state) => state.setIsInitializingEscrow,
  );
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useGlobalUIBoundedStore((state) => state.resetSteps);
  const setCurrentStep = useEscrowUIBoundedStore(
    (state) => state.setCurrentStep,
  );
  const fetchContacts = useGlobalBoundedStore((state) => state.fetchContacts);
  const contacts = useGlobalBoundedStore((state) => state.contacts);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const escrowType = useEscrowUIBoundedStore((state) => state.escrowType);
  const { getMultiReleaseFormSchema } = useInitializeEscrowSchema();
  const formSchema = getMultiReleaseFormSchema();
  const { currentNetwork } = useNetwork();

  const { deployEscrow } = useEscrowsMutations();

  useEffect(() => {
    if (address) {
      fetchContacts(address);
    }
  }, [fetchContacts, address]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engagementId: "",
      title: "",
      description: "",
      platformFee: undefined,
      trustline: {
        address: "",
        symbol: "",
      },
      roles: {
        approver: "",
        serviceProvider: "",
        platformAddress: "",
        releaseSigner: "",
        disputeResolver: "",
      },
      milestones: [{ description: "", receiver: "", amount: undefined }],
    },
    mode: "onChange",
  });

  const fillTemplateForm = () => {
    // Filter trustlines by current network
    const networkTrustlines = trustlines.filter(
      (tl) => tl.network === currentNetwork,
    );

    // Find the USDC trustline for current network
    const usdcTrustline =
      networkTrustlines.find((tl) =>
        tl.symbol?.toLowerCase().includes("usdc"),
      ) || networkTrustlines[0];

    if (!usdcTrustline) {
      toast.error(`No trustline available for ${currentNetwork}`);
      return;
    }

    const templateData: z.infer<typeof formSchema> = {
      engagementId: "ENG-001",
      title: "Design Landing Page",
      description: "Landing for the new product of the company.",
      platformFee: 5,
      trustline: {
        address: usdcTrustline.address,
        symbol: usdcTrustline.symbol,
      },
      roles: {
        approver: address || "",
        serviceProvider: address || "",
        platformAddress: address || "",
        releaseSigner: address || "",
        disputeResolver: address || "",
      },
      milestones: [
        {
          description: "Design the wireframe",
          receiver: address || "",
          amount: 2,
        },
      ],
    };

    // Set form values
    Object.entries(templateData).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });

    // Explicitly set the trustline field
    form.setValue("trustline.address", usdcTrustline.address);
  };

  const milestones = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "",
  );

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [
      ...currentMilestones,
      { description: "", receiver: "", amount: 0 },
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

    const trustline = trustlines.find(
      (tl) => tl.address === payload.trustline.address,
    );

    if (!trustline) {
      toast.error("Trustline not found");
      return;
    }

    setIsInitializingEscrow(true);

    try {
      // Convert string values to numbers for the payload
      const processedPayload = {
        ...payload,
        platformFee:
          typeof payload.platformFee === "string"
            ? Number(payload.platformFee)
            : payload.platformFee,
        signer: address,
        milestones: payload.milestones.map((milestone) => ({
          ...milestone,
          amount:
            typeof milestone.amount === "string"
              ? Number(milestone.amount)
              : milestone.amount,
        })),
        trustline: {
          address: trustline.address,
          symbol: trustline.symbol,
        },
      };

      const finalPayload: InitializeMultiReleaseEscrowPayload =
        processedPayload;

      (await deployEscrow.mutateAsync({
        payload: finalPayload,
        type: "multi-release",
        address,
      })) as InitializeMultiReleaseEscrowResponse & { escrow: Escrow };

      setIsSuccessDialogOpen(true);
      resetSteps();
      setCurrentStep(1);
      toast.success("Escrow initialized successfully");
      router.push("/dashboard/escrow/my-escrows");
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsInitializingEscrow(false);
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
    // Filter trustlines by current network
    const networkTrustlines = trustlines.filter(
      (tl) => tl.network === currentNetwork,
    );

    const options = networkTrustlines.map((trustline) => ({
      value: trustline.address,
      label: trustline.symbol,
    }));

    return [{ value: "", label: "Select a Trustline" }, ...options];
  }, [currentNetwork]);

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
