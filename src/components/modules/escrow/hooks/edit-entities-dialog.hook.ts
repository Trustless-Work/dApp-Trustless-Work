"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { useMemo, useState } from "react";
import { GetFormSchema } from "../schema/edit-entities.schema";
import { toast } from "sonner";
import { useUsersQuery } from "@/components/modules/contact/hooks/tanstack/useUsersQuery";
import {
  UpdateMultiReleaseEscrowPayload,
  UpdateSingleReleaseEscrowPayload,
} from "@trustless-work/escrow";
import { Escrow } from "@/@types/escrow.entity";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

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
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const { data: users = [] } = useUsersQuery();

  const { updateEscrow } = useEscrowsMutations();

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
      approver: selectedEscrow?.roles?.approver || "",
      serviceProvider: selectedEscrow?.roles?.serviceProvider || "",
      platformAddress: selectedEscrow?.roles?.platformAddress || "",
      receiver: selectedEscrow?.roles?.receiver || "",
      releaseSigner: selectedEscrow?.roles?.releaseSigner || "",
      disputeResolver: selectedEscrow?.roles?.disputeResolver || "",
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
        roles: {
          approver: payload.approver,
          serviceProvider: payload.serviceProvider,
          platformAddress: payload.platformAddress,
          receiver: payload.receiver,
          releaseSigner: payload.releaseSigner,
          disputeResolver: payload.disputeResolver,
        },
      };

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const finalPayload:
        | UpdateMultiReleaseEscrowPayload
        | UpdateSingleReleaseEscrowPayload = {
        escrow: updatedEscrow as Escrow,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      await updateEscrow.mutateAsync({
        payload: finalPayload,
        type: selectedEscrow.type,
        address,
      });

      setIsEditEntitiesDialogOpen(false);

      toast.success(`You have edited the entities of ${selectedEscrow.title}.`);
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsEditingEntities(false);
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
