/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { useMemo, useState } from "react";
import { GetFormSchema } from "../../../schema/edit-entities.schema";
import {
  EscrowPayload,
  UpdateEscrowPayload,
} from "@/@types/escrows/escrow-payload.entity";
import { trustlessWorkService } from "../../../services/trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { toast } from "sonner";

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

      const finalPayload: UpdateEscrowPayload = {
        escrow: updatedEscrow as EscrowPayload,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/update-escrow-by-contract-id",
        method: "put",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

      if (response.status === "SUCCESS") {
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsEditEntitiesDialogOpen(false);
        setIsDialogOpen(false);

        toast.success(
          `You have edited the entities of ${selectedEscrow.title}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
