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
import { signTransaction } from "@/lib/stellar-wallet-kit";
import {
  useUpdateEscrow,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  UpdateMultiReleaseEscrowPayload,
  MultiReleaseEscrow,
} from "@trustless-work/escrow";

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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );

  const { updateEscrow } = useUpdateEscrow();
  const { sendTransaction } = useSendTransaction();

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
      const updatedEscrow = {
        ...JSON.parse(JSON.stringify(selectedEscrow)),
        milestones: payload.milestones,
      };

      delete updatedEscrow.createdAt;
      delete updatedEscrow.updatedAt;
      delete updatedEscrow.id;

      const finalPayload: UpdateMultiReleaseEscrowPayload = {
        escrow: updatedEscrow as MultiReleaseEscrow,
        signer: address,
        contractId: selectedEscrow.contractId || "",
      };

      const { unsignedTransaction } = await updateEscrow({
        payload: finalPayload,
        type: "multi-release",
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
