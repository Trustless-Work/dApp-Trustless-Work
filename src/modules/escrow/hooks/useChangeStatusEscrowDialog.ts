"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { formSchema } from "../schema/change-milestone-status.schema";
import { useEscrowBoundedStore } from "../store/data";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { handleError } from "@/errors/handle-errors";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

interface changeMilestoneStatusDialogHook {
  setIsChangeMilestoneStatusDialogOpen: (value: boolean) => void;
}

const useChangeMilestoneStatusDialogHook = ({
  setIsChangeMilestoneStatusDialogOpen,
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
      newStatus: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsChangingStatus(true);

    try {
      await changeMilestoneStatus.mutateAsync({
        payload: {
          contractId: selectedEscrow?.contractId || "",
          milestoneIndex: milestoneIndex?.toString() || "0",
          newStatus: payload.newStatus,
          serviceProvider: address,
          newEvidence: payload.newEvidence || "",
        },
        type: selectedEscrow?.type || "single-release",
        address,
      });

      setIsChangingStatus(false);
      setIsChangeMilestoneStatusDialogOpen(false);

      if (selectedEscrow && milestoneIndex !== null) {
        const updatedEscrow = {
          ...selectedEscrow,
          milestones: selectedEscrow.milestones.map((milestone, index) =>
            index === milestoneIndex
              ? {
                  ...milestone,
                  status: payload.newStatus,
                  evidence: payload.newEvidence || milestone.evidence,
                }
              : milestone,
          ),
        };
        setSelectedEscrow(updatedEscrow);
      }

      form.reset();

      toast.success(
        `The Milestone ${completingMilestone?.description} status has been changed.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleClose = () => {
    setIsChangeMilestoneStatusDialogOpen?.(false);
  };

  return {
    form,
    onSubmit,
    handleClose,
    setIsDialogOpen,
  };
};

export default useChangeMilestoneStatusDialogHook;
