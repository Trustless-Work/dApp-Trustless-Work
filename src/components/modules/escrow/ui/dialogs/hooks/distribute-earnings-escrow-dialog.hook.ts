/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distribute-escrow-earnings.service";
import { toast } from "@/hooks/toast.hook";

const useDistributeEarningsEscrowDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

  const distributeEscrowEarningsSubmit = async () => {
    setIsChangingStatus(true);
    setIsSuccessReleaseDialogOpen(false);

    if (!selectedEscrow) return;

    try {
      const response = await distributeEscrowEarnings({
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.serviceProvider,
        releaseSigner: selectedEscrow?.releaseSigner,
      });

      if (response.status === "SUCCESS") {
        setIsSuccessReleaseDialogOpen(true);
        fetchAllEscrows({ address, type: activeTab || "approver" });
        setIsDialogOpen(false);
        setIsChangingStatus(false);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast({
          title: "Success",
          description: `You have released the payment in ${selectedEscrow.title}.`,
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

  return { distributeEscrowEarningsSubmit };
};

export default useDistributeEarningsEscrowDialog;
