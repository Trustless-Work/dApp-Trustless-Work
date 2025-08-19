"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { formSchemaSingle } from "../../schema/edit-milestone.schema";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { toast } from "sonner";
import { UpdateSingleReleaseEscrowPayload } from "@trustless-work/escrow";
import { Escrow } from "@/types/escrow.entity";
import { handleError } from "@/errors/handle-errors";
import { AxiosError } from "axios";
import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";

interface useEditMilestonesDialogProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

export const useEditSingleMilestonesDialog = ({
  setIsEditMilestoneDialogOpen,
}: useEditMilestonesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingMilestones = useEscrowUIBoundedStore(
    (state) => state.setIsEditingMilestones,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const { updateEscrow } = useEscrowsMutations();

  const form = useForm<z.infer<typeof formSchemaSingle>>({
    resolver: zodResolver(formSchemaSingle),
    defaultValues: {
      milestones: selectedEscrow?.milestones || [{ description: "" }],
    },
    mode: "onChange",
  });

  const milestones: z.infer<typeof formSchemaSingle>["milestones"] =
    form.watch("milestones");

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

  const onSubmit = async (payload: z.infer<typeof formSchemaSingle>) => {
    if (!selectedEscrow) return;

    setIsEditingMilestones(true);

    try {
      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        milestones: payload.milestones,
      };

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const finalPayload: UpdateSingleReleaseEscrowPayload = {
        escrow: updatedEscrow as Escrow,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      await updateEscrow.mutateAsync({
        payload: finalPayload,
        type: "single-release",
        address,
      });

      setSelectedEscrow({
        ...selectedEscrow,
        milestones: payload.milestones,
      });

      setIsEditMilestoneDialogOpen(false);

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
