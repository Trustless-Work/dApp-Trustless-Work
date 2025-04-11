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
import { toast } from "@/hooks/toast.hook";
import { formSchema } from "../../../schema/complete-milestone.schema";
import { useEscrowBoundedStore } from "../../../store/data";
import { changeMilestoneStatus } from "../../../services/change-milestone-status.service";
import { ChangeMilestoneStatusPayload } from "@/@types/escrow.entity";

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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evidence: "",
    },
    mode: "onChange",
  });

  const onSubmit = async ({
    evidence,
  }: Pick<ChangeMilestoneStatusPayload, "evidence">) => {
    setIsChangingStatus(true);
    try {
      const response = await changeMilestoneStatus({
        contractId: selectedEscrow?.contractId,
        milestoneIndex: milestoneIndex?.toString() || "0",
        newStatus: "completed",
        serviceProvider: address,
        newEvidence: evidence,
      });

      if (response.status === "SUCCESS") {
        setIsChangingStatus(false);
        setIsDialogOpen(false);
        setIsCompleteMilestoneDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "serviceProvider" });

        toast({
          title: "Success",
          description: `The Milestone ${completingMilestone?.description} has been completed.`,
        });
      }
    } catch (error: any) {
      setIsChangingStatus(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
