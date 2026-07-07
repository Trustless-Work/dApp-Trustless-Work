"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  InitializeMultiReleaseEscrowPayload,
  InitializeSingleReleaseEscrowPayload,
} from "@trustless-work/escrow";
import { useInitializeEscrow } from "@trustless-work/escrow";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { playSound } from "@/lib/sounds";
import { toast } from "sonner";
import { trustlineOptions } from "@/components/tw-blocks/wallet-kit/trustlines";
import {
  getBasicsStepFields,
  getRolesStepFields,
} from "@/features/escrows/constants/create-escrow.constants";
import { escrowsQueryKey } from "@/features/escrows/constants/escrow.constants";
import { useSignAndSend } from "@/features/escrows/hooks/useSignAndSend";
import {
  createEscrowSchema,
  type CreateEscrowFormData,
  type CreateEscrowMilestoneFormData,
  type MultiReleaseCreateFormData,
  type SingleReleaseCreateFormData,
} from "@/features/escrows/schemas/create-escrow.schema";
import {
  localEscrowRepository,
  toStoredEscrow,
} from "@/features/escrows/services/escrow-repository";
import type { EscrowType } from "@/features/escrows/types/escrow.types";
import { getEscrowErrorMessage } from "@/features/escrows/utils/escrow-error.helper";
import { useWalletContext } from "@/providers/WalletProvider";

const defaultTrustline = trustlineOptions[0];

function buildDefaultRoles(walletAddress: string) {
  const address = walletAddress || "";

  return {
    approvers: [address],
    serviceProviders: [address],
    platform: address,
    releaseSigners: [address],
    disputeResolvers: [address],
    receiver: address,
    admin: address,
  };
}

function getDefaultValues(
  type: EscrowType,
  walletAddress: string,
): CreateEscrowFormData {
  const roles = buildDefaultRoles(walletAddress);
  const trustline = {
    address: defaultTrustline?.value ?? "",
    symbol: defaultTrustline?.label ?? "USDC",
  };

  if (type === "multi-release") {
    return {
      type: "multi-release",
      engagementId: "",
      title: "",
      description: "",
      platformFee: 2,
      roles: {
        approvers: roles.approvers,
        serviceProviders: roles.serviceProviders,
        platform: roles.platform,
        releaseSigners: roles.releaseSigners,
        disputeResolvers: roles.disputeResolvers,
        admin: roles.admin,
      },
      milestones: [
        {
          description: "",
          approvalsTarget: 1,
          amount: 0,
          receiver: walletAddress,
        },
      ],
      trustline,
    };
  }

  return {
    type: "single-release",
    engagementId: "",
    title: "",
    description: "",
    amount: 0,
    platformFee: 2,
    roles,
    milestones: [{ description: "", approvalsTarget: 1 }],
    trustline,
  };
}

function buildTemplateValues(
  type: EscrowType,
  walletAddress: string,
): CreateEscrowFormData {
  const roles = buildDefaultRoles(walletAddress);
  const trustline = {
    address: defaultTrustline?.value ?? "",
    symbol: defaultTrustline?.label ?? "USDC",
  };

  if (type === "multi-release") {
    return {
      type: "multi-release",
      engagementId: `eng-multi-${Date.now()}`,
      title: "Multi-release project template",
      description:
        "Milestone-based payments released independently as work is approved.",
      platformFee: 2,
      roles: {
        approvers: roles.approvers,
        serviceProviders: roles.serviceProviders,
        platform: roles.platform,
        releaseSigners: roles.releaseSigners,
        disputeResolvers: roles.disputeResolvers,
        admin: roles.admin,
      },
      milestones: [
        {
          description: "Discovery and planning deliverables",
          approvalsTarget: 1,
          amount: 250,
          receiver: walletAddress,
        },
        {
          description: "Implementation and QA",
          approvalsTarget: 1,
          amount: 750,
          receiver: walletAddress,
        },
      ],
      trustline,
    };
  }

  return {
    type: "single-release",
    engagementId: `eng-single-${Date.now()}`,
    title: "Single-release service template",
    description:
      "One escrow with multiple milestones and a single payout once all are approved.",
    amount: 1000,
    platformFee: 2,
    roles: {
      ...roles,
      approvers: walletAddress ? [walletAddress] : [""],
    },
    milestones: [
      {
        description: "Initial delivery and review",
        approvalsTarget: 1,
      },
      {
        description: "Final acceptance",
        approvalsTarget: 1,
      },
    ],
    trustline,
  };
}

function migrateFormValues(
  current: CreateEscrowFormData,
  nextType: EscrowType,
  walletAddress: string,
): CreateEscrowFormData {
  const shared = {
    engagementId: current.engagementId,
    title: current.title,
    description: current.description,
    platformFee: current.platformFee,
    trustline: current.trustline,
  };

  const rolesBase = {
    approvers: current.roles.approvers,
    serviceProviders: current.roles.serviceProviders,
    platform: current.roles.platform,
    releaseSigners: current.roles.releaseSigners,
    disputeResolvers: current.roles.disputeResolvers,
    admin: current.roles.admin,
  };

  if (nextType === "multi-release") {
    const receiver =
      current.type === "single-release"
        ? current.roles.receiver
        : walletAddress;

    return {
      type: "multi-release",
      ...shared,
      roles: rolesBase,
      milestones: current.milestones.map(
        (milestone: CreateEscrowMilestoneFormData) => ({
          description: milestone.description,
          approvalsTarget: milestone.approvalsTarget,
          amount:
            "amount" in milestone && typeof milestone.amount === "number"
              ? milestone.amount
              : 0,
          receiver,
        }),
      ),
    };
  }

  const receiver =
    current.type === "single-release"
      ? current.roles.receiver
      : walletAddress;
  const amount = current.type === "single-release" ? current.amount : 0;

  return {
    type: "single-release",
    ...shared,
    amount,
    roles: {
      ...rolesBase,
      receiver,
    },
    milestones: current.milestones.map(
      (milestone: CreateEscrowMilestoneFormData) => ({
        description: milestone.description,
        approvalsTarget: milestone.approvalsTarget,
      }),
    ),
  };
}

function toInitializePayload(
  values: CreateEscrowFormData,
  signer: string,
):
  | InitializeSingleReleaseEscrowPayload
  | InitializeMultiReleaseEscrowPayload {
  const rolesBase = {
    approvers: values.roles.approvers,
    serviceProviders: values.roles.serviceProviders,
    platform: values.roles.platform,
    releaseSigners: values.roles.releaseSigners,
    disputeResolvers: values.roles.disputeResolvers,
    admin: values.roles.admin,
  };

  if (values.type === "multi-release") {
    const multiValues = values as MultiReleaseCreateFormData;

    return {
      signer,
      engagementId: multiValues.engagementId,
      title: multiValues.title,
      description: multiValues.description,
      platformFee: multiValues.platformFee,
      roles: rolesBase,
      milestones: multiValues.milestones.map((milestone) => ({
        description: milestone.description,
        approvalsTarget: milestone.approvalsTarget,
        amount: milestone.amount,
        receiver: milestone.receiver,
      })),
      trustline: multiValues.trustline,
    };
  }

  const singleValues = values as SingleReleaseCreateFormData;

  return {
    signer,
    engagementId: singleValues.engagementId,
    title: singleValues.title,
    description: singleValues.description,
    amount: singleValues.amount,
    platformFee: singleValues.platformFee,
    roles: {
      ...rolesBase,
      receiver: singleValues.roles.receiver,
    },
    milestones: singleValues.milestones.map((milestone) => ({
      description: milestone.description,
      approvalsTarget: milestone.approvalsTarget,
    })),
    trustline: singleValues.trustline,
  };
}

type UseCreateEscrowFormOptions = {
  initialType?: EscrowType;
  onSuccess?: () => void;
};

export function useCreateEscrowForm(options?: UseCreateEscrowFormOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { walletAddress } = useWalletContext();
  const { deployEscrow } = useInitializeEscrow();
  const { signAndSend, loading } = useSignAndSend();
  const initialType = options?.initialType ?? "single-release";

  const [escrowType, setEscrowTypeState] = useState<EscrowType>(initialType);

  const form = useForm<CreateEscrowFormData>({
    resolver: zodResolver(createEscrowSchema),
    defaultValues: getDefaultValues(initialType, walletAddress ?? ""),
    mode: "onChange",
  });

  const setEscrowType = useCallback(
    (type: EscrowType) => {
      if (escrowType === type) {
        return;
      }

      const migrated = migrateFormValues(
        form.getValues(),
        type,
        walletAddress ?? "",
      );

      form.reset(migrated, { keepDefaultValues: false });
      form.clearErrors();
      setEscrowTypeState(type);
    },
    [escrowType, form, walletAddress],
  );

  const applyTemplate = useCallback(() => {
    const template = buildTemplateValues(escrowType, walletAddress ?? "");
    form.reset(template, { keepDefaultValues: false });
    form.clearErrors();
    toast.success("Template applied", {
      description: "Review and adjust the fields before deploying.",
    });
  }, [escrowType, form, walletAddress]);

  const validateStep = useCallback(
    async (step: number) => {
      const type = escrowType;

      if (step === 0) {
        return form.trigger(getBasicsStepFields(type));
      }

      if (step === 1) {
        return form.trigger(getRolesStepFields(type));
      }

      return form.trigger();
    },
    [escrowType, form],
  );

  const resetForm = useCallback(
    (type: EscrowType = initialType) => {
      form.reset(getDefaultValues(type, walletAddress ?? ""), {
        keepDefaultValues: false,
      });
      form.clearErrors();
      setEscrowTypeState(type);
    },
    [form, initialType, walletAddress],
  );

  const onSubmit = async (values: CreateEscrowFormData) => {
    if (!walletAddress) {
      toast.error("Connect your wallet to create an escrow.");
      return;
    }

    const payload = toInitializePayload(values, walletAddress);

    try {
      const response = await signAndSend(() =>
        deployEscrow(payload, values.type),
      );

      const contractId = response.contractId;
      const escrow = response.escrow;

      if (!contractId || !escrow) {
        toast.error("Escrow deployed but contract details were not returned.");
        return;
      }

      const stored = toStoredEscrow(escrow, contractId);
      localEscrowRepository.upsert(walletAddress, stored);

      await queryClient.invalidateQueries({
        queryKey: escrowsQueryKey(walletAddress),
      });

      toast.success("Escrow created successfully");
      playSound("deploy");
      options?.onSuccess?.();
      router.push(`/dashboard/escrows/${contractId}`);
    } catch (error) {
      playSound("error");
      toast.error(getEscrowErrorMessage(error));
    }
  };

  return {
    form,
    onSubmit,
    loading,
    walletAddress,
    escrowType,
    setEscrowType,
    applyTemplate,
    validateStep,
    resetForm,
  };
}
