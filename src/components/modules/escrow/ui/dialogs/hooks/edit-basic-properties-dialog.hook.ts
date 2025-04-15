/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { EscrowPayload } from "@/@types/escrow.entity";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { toast } from "@/hooks/toast.hook";
import { editMilestones } from "../../../services/edit-milestones.service";
import { formSchema } from "../../../schema/edit-basic-properties.schema";

interface useEditBasicPropertiesDialogProps {
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

const useEditBasicPropertiesDialog = ({
  setIsEditBasicPropertiesDialogOpen,
}: useEditBasicPropertiesDialogProps) => {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedEscrow?.title || "",
      engagementId: selectedEscrow?.engagementId || "",
      description: selectedEscrow?.description || "",
      amount: selectedEscrow?.amount || "",
      receiverMemo: selectedEscrow?.receiverMemo?.toString() || "0",
      platformFee: selectedEscrow?.platformFee || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
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

      const newPayload = {
        escrow: updatedEscrow as EscrowPayload,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const response = await editMilestones(newPayload);

      if (response.status === "SUCCESS") {
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsEditBasicPropertiesDialogOpen(false);
        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: `You have edited the basic properties of ${selectedEscrow.title}.`,
        });
      }

      setIsEditingBasicProperties(false);
    } catch (error: any) {
      setIsEditingBasicProperties(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

export default useEditBasicPropertiesDialog;
