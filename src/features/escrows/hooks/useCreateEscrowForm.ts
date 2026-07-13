"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useInitializeEscrow } from "@trustless-work/escrow";
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
import { escrowsQueryKey } from "@/features/escrows/constants/escrow.constants";
import { useSignAndSend } from "@/features/escrows/hooks/useSignAndSend";
import {
  createEscrowSchema,
  type CreateEscrowFormData,
} from "@/features/escrows/schemas/create-escrow.schema";
import {
  localEscrowRepository,
  toStoredEscrow,
} from "@/features/escrows/services/escrow-repository";
import type { EscrowType } from "@/features/escrows/types/escrow.types";
import { getEscrowErrorMessage } from "@/features/escrows/utils/escrow-error.helper";
import {
  buildTemplateValues,
  getDefaultValues,
  migrateFormValues,
} from "@/features/escrows/utils/create-escrow-form.helper";
import { toInitializePayload } from "@/features/escrows/utils/create-escrow-payload.helper";
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
