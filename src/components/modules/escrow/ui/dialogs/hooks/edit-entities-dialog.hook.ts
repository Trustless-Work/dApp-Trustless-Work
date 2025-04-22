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
import { editEscrow } from "../../../services/edit-escrow.service";
import { useMemo, useState } from "react";
import { GetFormSchema } from "../../../schema/edit-entities.schema";

interface useEditEntitiesDialogProps {
  setIsEditEntitiesDialogOpen: (value: boolean) => void;
}

const useEditEntitiesDialog = ({
  setIsEditEntitiesDialogOpen,
}: useEditEntitiesDialogProps) => {
  const formSchema = GetFormSchema();

  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
    receiver: false,
  });

  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingEntities = useEscrowUIBoundedStore(
    (state) => state.setIsEditingEntities,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const users = useGlobalAuthenticationStore((state) => state.users);

  const userOptions = useMemo(() => {
    const options = users.map((user) => ({
      value: user.address,
      label: `${user.firstName} ${user.lastName}`,
    }));

    return [{ value: "", label: "Select an User" }, ...options];
  }, [users]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approver: selectedEscrow?.approver || "",
      serviceProvider: selectedEscrow?.serviceProvider || "",
      platformAddress: selectedEscrow?.platformAddress || "",
      receiver: selectedEscrow?.receiver || "",
      releaseSigner: selectedEscrow?.releaseSigner || "",
      disputeResolver: selectedEscrow?.disputeResolver || "",
    },
    mode: "onChange",
  });

  const toggleField = (field: string, value: boolean) => {
    setShowSelect((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    if (!selectedEscrow) return;

    setIsEditingEntities(true);

    try {
      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        approver: payload.approver,
        serviceProvider: payload.serviceProvider,
        platformAddress: payload.platformAddress,
        receiver: payload.receiver,
        releaseSigner: payload.releaseSigner,
        disputeResolver: payload.disputeResolver,
      };

      // Plain the trustline
      if (
        updatedEscrow.trustline &&
        typeof updatedEscrow.trustline === "object"
      ) {
        updatedEscrow.trustlineDecimals =
          updatedEscrow.trustline.trustlineDecimals;
        updatedEscrow.trustline = updatedEscrow.trustline.trustline;
      }

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const newPayload = {
        escrow: updatedEscrow as EscrowPayload,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const response = await editEscrow(newPayload);

      if (response.status === "SUCCESS") {
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsEditEntitiesDialogOpen(false);
        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: `You have edited the entities of ${selectedEscrow.title}.`,
        });
      }

      setIsEditingEntities(false);
    } catch (error: any) {
      setIsEditingEntities(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsEditEntitiesDialogOpen(false);
  };

  return {
    form,
    userOptions,
    showSelect,
    toggleField,
    onSubmit,
    handleClose,
  };
};

export default useEditEntitiesDialog;
