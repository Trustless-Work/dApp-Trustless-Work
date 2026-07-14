"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDeployEscrow } from "@trustless-work/escrow";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { playSound } from "@/lib/sounds";
import { toast } from "sonner";
import {
  getBasicsStepFields,
  getRolesStepFields,
} from "@/features/escrows/constants/create-escrow.constants";
import { ESCROWS_LIST_QUERY_ROOT } from "@/features/escrows/constants/escrow.constants";
import { useSignAndSend } from "@/features/escrows/hooks/useSignAndSend";
import {
  createEscrowSchema,
  type CreateEscrowFormData,
} from "@/features/escrows/schemas/create-escrow.schema";
import type { EscrowType } from "@/features/escrows/types/escrow.types";
import { getEscrowErrorMessage } from "@/features/escrows/utils/escrow-error.helper";
import {
  buildTemplateValues,
  getDefaultValues,
  migrateFormValues,
} from "@/features/escrows/utils/create-escrow-form.helper";
import { toDeployPayload } from "@/features/escrows/utils/create-escrow-payload.helper";
import { showEscrowTransactionSuccessToast } from "@/features/escrows/utils/escrow-transaction-toast.helper";
import { useWalletContext } from "@/providers/WalletProvider";

type UseCreateEscrowFormOptions = {
  initialType?: EscrowType;
  onSuccess?: () => void;
};

export function useCreateEscrowForm(options?: UseCreateEscrowFormOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { walletAddress } = useWalletContext();
  const { deployEscrow } = useDeployEscrow();
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

    const payload = toDeployPayload(values, walletAddress);

    try {
      // Attribution (`X-TW-Platform`) is optional and must be a Core platform id,
      // not the dApp organization id. The API key already scopes the platform.
      const response = await signAndSend(() =>
        deployEscrow(payload, values.type),
      );

      const contractId = response.contractId;

      if (!contractId) {
        toast.error("Escrow deployed but contract id was not returned.");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ESCROWS_LIST_QUERY_ROOT,
      });

      showEscrowTransactionSuccessToast({
        title: "Escrow created successfully",
        txHash: response.txHash,
      });
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
