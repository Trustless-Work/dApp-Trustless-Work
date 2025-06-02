/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { trustlessWorkService } from "../services/trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { ChangeMilestoneStatusPayload } from "@/@types/escrows/escrow-payload.entity";
import { toast } from "sonner";

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
      newEvidence: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: ChangeMilestoneStatusPayload) => {
    setIsChangingStatus(true);

    try {
      const finalPayload: ChangeMilestoneStatusPayload = {
        contractId: selectedEscrow?.contractId,
        milestoneIndex: milestoneIndex?.toString() || "0",
        newStatus: "completed",
        serviceProvider: address,
        newEvidence: payload.newEvidence || "",
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/change-milestone-status",
        method: "post",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

      if (response.status === "SUCCESS") {
        setIsChangingStatus(false);
        setIsDialogOpen(false);
        setIsCompleteMilestoneDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "serviceProvider" });

        toast.success(
          `The Milestone ${completingMilestone?.description} has been completed.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
