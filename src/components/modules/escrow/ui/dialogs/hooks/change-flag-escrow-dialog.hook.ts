/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { Escrow, Milestone } from "@/@types/escrows/escrow.entity";
import { trustlessWorkService } from "../../../services/trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { ChangeMilestoneFlagPayload } from "@/@types/escrows/escrow-payload.entity";
import { toast } from "sonner";

const useChangeFlagEscrowDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingFlag = useEscrowUIBoundedStore(
    (state) => state.setIsChangingFlag,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const changeMilestoneFlagSubmit = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    setIsChangingFlag(true);

    try {
      const finalPayload: ChangeMilestoneFlagPayload = {
        contractId: selectedEscrow?.contractId,
        milestoneIndex: index.toString(),
        newFlag: true,
        approver: address,
      };

      const response = (await trustlessWorkService({
        payload: finalPayload,
        endpoint: "/escrow/change-milestone-approved-flag",
        method: "post",
        returnEscrowDataIsRequired: false,
      })) as EscrowRequestResponse;

      if (response.status === "SUCCESS") {
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast.success(
          `The Milestone ${milestone.description} has been approved.`,
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsChangingFlag(false);
    }
  };

  return { changeMilestoneFlagSubmit };
};

export default useChangeFlagEscrowDialog;
