/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { formSchema } from "../../../schema/edit-milestone.schema";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { Milestone } from "@/@types/escrows/escrow.entity";
import {
  EscrowPayload,
  UpdateEscrowPayload,
} from "@/@types/escrows/escrow-payload.entity";
import { trustlessWorkService } from "../../../services/trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { toast } from "sonner";

interface useEditMilestonesDialogProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const useEditMilestonesDialog = ({
  setIsEditMilestoneDialogOpen,
}: useEditMilestonesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingMilestones = useEscrowUIBoundedStore(
    (state) => state.setIsEditingMilestones,
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
      milestones: selectedEscrow?.milestones || [{ description: "" }],
    },
    mode: "onChange",
  });

  const milestones: Milestone[] = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "",
  );

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [
      ...currentMilestones,
      { description: "", status: "pending" },
    ];
    form.setValue("milestones", updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    if (!selectedEscrow) return;

    setIsEditingMilestones(true);

    try {
      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        milestones: payload.milestones,
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
        setIsEditMilestoneDialogOpen(false);
        setIsDialogOpen(false);

        toast.success(
          `You have edited the milestones of ${selectedEscrow.title}.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsEditingMilestones(false);
    }
  };

  const handleClose = () => {
    setIsEditMilestoneDialogOpen(false);
  };

  return {
    onSubmit,
    form,
    handleClose,
    milestones,
    handleAddMilestone,
    handleRemoveMilestone,
    isAnyMilestoneEmpty,
  };
};

export default useEditMilestonesDialog;
