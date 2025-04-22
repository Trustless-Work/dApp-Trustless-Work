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
import { EscrowPayload, Milestone } from "@/@types/escrow.entity";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { toast } from "@/hooks/toast.hook";
import { editEscrow } from "../../../services/edit-escrow.service";

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

      const newPayload = {
        escrow: updatedEscrow as EscrowPayload,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const response = await editEscrow(newPayload);

      if (response.status === "SUCCESS") {
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsEditMilestoneDialogOpen(false);
        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: `You have edited the milestones of ${selectedEscrow.title}.`,
        });
      }

      setIsEditingMilestones(false);
    } catch (error: any) {
      setIsEditingMilestones(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
