/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { Escrow, Milestone } from "@/@types/escrow.entity";
import { changeMilestoneStatus } from "../../../services/change-milestone-status.service";
import { toast } from "@/hooks/toast.hook";

const useChangeStatusEscrowDialog = () => {
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
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

  const changeMilestoneStatusSubmit = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    setIsChangingStatus(true);

    try {
      const response = await changeMilestoneStatus({
        contractId: selectedEscrow?.contractId,
        milestoneIndex: index.toString(),
        newStatus: "completed",
        serviceProvider: address,
      });

      if (response.status === "SUCCESS") {
        setIsChangingStatus(false);
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "serviceProvider" });

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

export default useChangeStatusEscrowDialog;
