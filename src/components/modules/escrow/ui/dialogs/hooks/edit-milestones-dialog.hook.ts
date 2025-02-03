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
import { Milestone } from "@/@types/escrow.entity";
import { useEscrowBoundedStore } from "../../../store/ui";
import { toast } from "@/hooks/toast.hook";
import { editMilestones } from "../../../services/edit-milestones.service";

interface useEditMilestonesDialogProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const useEditMilestonesDialog = ({
  setIsEditMilestoneDialogOpen,
}: useEditMilestonesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsEditingMilestones = useEscrowBoundedStore(
    (state) => state.setIsEditingMilestones,
  );
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      milestones: selectedEscrow?.milestones || [{ description: "" }],
    },
  });

  const milestones: Milestone[] = form.watch("milestones");

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
        ...selectedEscrow,
        milestones: payload.milestones,
      };

      //const data = { status: "201" };
      const data = await editMilestones(updatedEscrow);

      const response = await updateEscrow({
        escrowId: selectedEscrow.id,
        payload: updatedEscrow,
      });

      if (data.status === "SUCCESS" /*|| data.status === 201*/ && response) {
        fetchAllEscrows({ address, type: activeTab || "client" });
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
  };
};

export default useEditMilestonesDialog;
