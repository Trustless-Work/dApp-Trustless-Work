"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { formSchemaMulti } from "../../schema/edit-basic-properties.schema";
import { toast } from "sonner";
import {
  MultiReleaseEscrow,
  UpdateMultiReleaseEscrowPayload,
} from "@trustless-work/escrow";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

interface useEditMultiBasicPropertiesDialogProps {
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

export const useEditMultiBasicPropertiesDialog = ({
  setIsEditBasicPropertiesDialogOpen,
}: useEditMultiBasicPropertiesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const setIsEditingBasicProperties = useEscrowUIBoundedStore(
    (state) => state.setIsEditingBasicProperties,
  );
  const { updateEscrow } = useEscrowsMutations();

  const form = useForm<z.infer<typeof formSchemaMulti>>({
    resolver: zodResolver(formSchemaMulti),
    defaultValues: {
      title: selectedEscrow?.title || "",
      engagementId: selectedEscrow?.engagementId || "",
      description: selectedEscrow?.description || "",
      receiverMemo: selectedEscrow?.receiverMemo?.toString() || "",
      platformFee: selectedEscrow?.platformFee || 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchemaMulti>) => {
    if (!selectedEscrow) return;

    setIsEditingBasicProperties(true);

    try {
      // Convert string values to numbers for the payload
      const processedPayload = {
        ...payload,
        platformFee:
          typeof payload.platformFee === "string"
            ? Number(payload.platformFee)
            : payload.platformFee,
      };

      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        title: processedPayload.title,
        engagementId: processedPayload.engagementId,
        description: processedPayload.description,
        receiverMemo: processedPayload.receiverMemo,
        platformFee: processedPayload.platformFee,
      };

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const finalPayload: UpdateMultiReleaseEscrowPayload = {
        escrow: updatedEscrow as MultiReleaseEscrow,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      await updateEscrow.mutateAsync({
        payload: finalPayload,
        type: "multi-release",
        address,
      });

      setIsEditBasicPropertiesDialogOpen(false);

      setSelectedEscrow({
        ...selectedEscrow,
        title: processedPayload.title,
        engagementId: processedPayload.engagementId,
        description: processedPayload.description,
        receiverMemo: processedPayload.receiverMemo
          ? Number(processedPayload.receiverMemo)
          : 0,
        platformFee: processedPayload.platformFee,
      });

      toast.success(
        `You have edited the basic properties of ${selectedEscrow.title}.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsEditingBasicProperties(false);
    }
  };

  const handleClose = () => {
    setIsEditBasicPropertiesDialogOpen(false);
  };

  return {
    form,
    onSubmit,
    handleClose,
  };
};
