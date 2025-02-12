/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../../../store/ui";
import { distributeEscrowEarnings } from "../../../services/distribute-escrow-earnings.service";
import { toast } from "@/hooks/toast.hook";
import { EscrowPayload } from "@/@types/escrow.entity";

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
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

  const distributeEscrowEarningsSubmit = async () => {
    setIsChangingStatus(true);
    setIsSuccessReleaseDialogOpen(false);

    if (!selectedEscrow) return;

    try {
      const data = await distributeEscrowEarnings({
        contractId: selectedEscrow?.contractId,
        signer: address,
        serviceProvider: selectedEscrow?.serviceProvider,
        releaseSigner: selectedEscrow?.releaseSigner,
      });

      const updatedPayload: EscrowPayload = {
        ...selectedEscrow,
        releaseFlag: true,
      };

      const responseFlag = await updateEscrow({
        escrowId: selectedEscrow.id,
        payload: updatedPayload,
      });

      if ((data.status === "SUCCESS" || data.status === 201) && responseFlag) {
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
