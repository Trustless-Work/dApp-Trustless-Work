"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { formSchema } from "../schema/complete-milestone.schema";
import { useEscrowBoundedStore } from "../store/data";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

interface changeMilestoneStatusDialogHook {
  setIsCompleteMilestoneDialogOpen: (value: boolean) => void;
}

const useChangeMilestoneStatusDialogHook = ({
  setIsCompleteMilestoneDialogOpen,
}: changeMilestoneStatusDialogHook) => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowUIBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const completingMilestone = useEscrowBoundedStore(
    (state) => state.completingMilestone,
  );
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);

  const { changeMilestoneStatus } = useEscrowsMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEvidence: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (newEvidence: string | undefined) => {
    setIsChangingStatus(true);

    try {
      await changeMilestoneStatus.mutateAsync({
        payload: {
          contractId: selectedEscrow?.contractId || "",
          milestoneIndex: milestoneIndex?.toString() || "0",
          newStatus: "completed",
          serviceProvider: address,
          newEvidence: newEvidence || "",
        },
        type: selectedEscrow?.type || "single-release",
        address,
      });

      setIsChangingStatus(false);
      setIsCompleteMilestoneDialogOpen(false);

      if (selectedEscrow && milestoneIndex !== null) {
        const updatedEscrow = {
          ...selectedEscrow,
          milestones: selectedEscrow.milestones.map((milestone, index) =>
            index === milestoneIndex
              ? {
                  ...milestone,
                  status: "completed",
                  evidence: newEvidence || milestone.evidence,
                }
              : milestone,
          ),
        };
        setSelectedEscrow(updatedEscrow);
      }

      form.reset();

      toast.success(
        `The Milestone ${completingMilestone?.description} has been completed.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleClose = () => {
    setIsCompleteMilestoneDialogOpen?.(false);
  };

  return {
    form,
    onSubmit,
    handleClose,
    setIsDialogOpen,
  };
};

export default useChangeMilestoneStatusDialogHook;
