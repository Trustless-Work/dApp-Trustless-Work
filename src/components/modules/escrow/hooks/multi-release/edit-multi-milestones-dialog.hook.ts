"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { formSchemaMulti } from "../../schema/edit-milestone.schema";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import {
  UpdateMultiReleaseEscrowPayload,
  MultiReleaseEscrow,
} from "@trustless-work/escrow";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

interface useEditMultiMilestonesDialogProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

export const useEditMultiMilestonesDialog = ({
  setIsEditMilestoneDialogOpen,
}: useEditMultiMilestonesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingMilestones = useEscrowUIBoundedStore(
    (state) => state.setIsEditingMilestones,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const { updateEscrow } = useEscrowsMutations();

  const form = useForm<z.infer<typeof formSchemaMulti>>({
    resolver: zodResolver(formSchemaMulti),
    defaultValues: {
      milestones: selectedEscrow?.milestones || [
        { description: "", amount: 0 },
      ],
    },
    mode: "onChange",
  });

  const milestones: z.infer<typeof formSchemaMulti>["milestones"] =
    form.watch("milestones");

  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "" || milestone.amount === 0,
  );

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [
      ...currentMilestones,
      { description: "", amount: 0, status: "pending" },
    ];
    form.setValue("milestones", updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
  };

  const onSubmit = async (payload: z.infer<typeof formSchemaMulti>) => {
    if (!selectedEscrow) return;

    setIsEditingMilestones(true);

    try {
      // Convert string values to numbers for the payload
      const processedPayload = {
        ...payload,
        milestones: payload.milestones.map((milestone) => ({
          ...milestone,
          amount:
            typeof milestone.amount === "string"
              ? Number(milestone.amount)
              : milestone.amount,
        })),
      };

      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        milestones: processedPayload.milestones,
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

      setIsEditMilestoneDialogOpen(false);

      setSelectedEscrow({
        ...selectedEscrow,
        milestones: processedPayload.milestones,
      });

      toast.success(
        `You have edited the milestones of ${selectedEscrow.title}.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
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
