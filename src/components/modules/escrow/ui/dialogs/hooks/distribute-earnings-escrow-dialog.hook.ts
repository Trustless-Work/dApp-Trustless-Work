/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distribute-escrow-earnings.service";
import { toast } from "@/hooks/toast.hook";

const useDistributeEarningsEscrowDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowUIBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

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
