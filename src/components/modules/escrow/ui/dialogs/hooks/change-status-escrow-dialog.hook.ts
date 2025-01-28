/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import {
  Escrow,
  EscrowPayload,
  Milestone,
  MilestoneStatus,
} from "@/@types/escrow.entity";
import { changeMilestoneStatus } from "../../../services/change-milestone-status.service";
import { toast } from "@/hooks/use-toast";

const useChangeStatusEscrowDialogHook = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);

  const changeMilestoneStatusSubmit = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    setIsChangingStatus(true);

    try {
      await changeMilestoneStatus({
        contractId: selectedEscrow?.contractId,
        milestoneIndex: index.toString(),
        newStatus: "completed",
        serviceProvider: address,
      });

      const updatedMilestonesStatus = selectedEscrow.milestones.map(
        (m, i): Milestone =>
          i === index
            ? {
                ...m,
                status: "completed" as MilestoneStatus,
              }
            : m,
      );

      const updatedPayloadStatus: EscrowPayload = {
        ...selectedEscrow,
        milestones: updatedMilestonesStatus,
      };

      const responseStatus = await updateEscrow({
        escrowId: selectedEscrow.id,
        payload: updatedPayloadStatus,
      });

      setIsChangingStatus(false);

      if (responseStatus) {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);

        toast({
          title: "Success",
          description: `The Milestone ${milestone.description} has been completed.`,
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

  return { changeMilestoneStatusSubmit };
};

export default useChangeStatusEscrowDialogHook;
