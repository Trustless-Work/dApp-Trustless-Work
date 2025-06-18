"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { formSchemaSingle } from "../../schema/edit-basic-properties.schema";
import {
  useUpdateEscrow,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { toast } from "sonner";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { Escrow } from "@/@types/escrow.entity";
import { UpdateSingleReleaseEscrowPayload } from "@trustless-work/escrow";

interface useEditSingleBasicPropertiesDialogProps {
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

export const useEditSingleBasicPropertiesDialog = ({
  setIsEditBasicPropertiesDialogOpen,
}: useEditSingleBasicPropertiesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingBasicProperties = useEscrowUIBoundedStore(
    (state) => state.setIsEditingBasicProperties,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );

  const { updateEscrow } = useUpdateEscrow();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchemaSingle>>({
    resolver: zodResolver(formSchemaSingle),
    defaultValues: {
      title: selectedEscrow?.title || "",
      engagementId: selectedEscrow?.engagementId || "",
      description: selectedEscrow?.description || "",
      amount: selectedEscrow?.amount || "",
      receiverMemo: selectedEscrow?.receiverMemo?.toString() || "",
      platformFee: selectedEscrow?.platformFee || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchemaSingle>) => {
    if (!selectedEscrow) return;

    setIsEditingBasicProperties(true);

    try {
      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        title: payload.title,
        engagementId: payload.engagementId,
        description: payload.description,
        amount: payload.amount,
        receiverMemo: payload.receiverMemo,
        platformFee: payload.platformFee,
      };

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const finalPayload: UpdateSingleReleaseEscrowPayload = {
        escrow: updatedEscrow as Escrow,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const { unsignedTransaction } = await updateEscrow({
        payload: finalPayload,
        type: "single-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from updateEscrow response.",
        );
      }

      const signedTxXdr = await signTransaction({
        unsignedTransaction,
        address,
      });

      if (!signedTxXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const response = await sendTransaction(signedTxXdr);

      if (response.status === "SUCCESS") {
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsEditBasicPropertiesDialogOpen(false);
        setIsDialogOpen(false);

        toast.success(
          `You have edited the basic properties of ${selectedEscrow.title}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
