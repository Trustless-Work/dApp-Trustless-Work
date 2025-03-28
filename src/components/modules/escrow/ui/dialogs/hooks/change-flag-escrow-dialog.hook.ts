/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { Escrow, EscrowPayload, Milestone } from "@/@types/escrow.entity";
import { changeMilestoneFlag } from "../../../services/change-mileston-flag.service";
import { toast } from "@/hooks/toast.hook";

const useChangeFlagEscrowDialog = () => {
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

  const changeMilestoneFlagSubmit = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    setIsChangingStatus(true);

    try {
      await changeMilestoneFlag({
        contractId: selectedEscrow?.contractId,
        milestoneIndex: index.toString(),
        newFlag: true,
        approver: address,
      });

      const updatedMilestonesFlag = selectedEscrow.milestones.map(
        (m, i): Milestone =>
          i === index
            ? {
                ...m,
                flag: true,
              }
            : m,
      );

      const updatedPayloadFlag: EscrowPayload = {
        ...selectedEscrow,
        milestones: updatedMilestonesFlag,
      };

      const responseFlag = await updateEscrow({
        escrowId: selectedEscrow.id,
        payload: updatedPayloadFlag,
      });

      setIsChangingStatus(false);

      if (responseFlag) {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);

        toast({
          title: "Success",
          description: `The Milestone ${milestone.description} has been approved.`,
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

  return { changeMilestoneFlagSubmit };
};

export default useChangeFlagEscrowDialog;
