"use client";

import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { useEscrowUIBoundedStore } from "../store/ui";
import { toast } from "sonner";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow/types";
import { Escrow } from "@/types/escrow.entity";
import { AxiosError } from "axios";
import { handleError } from "@/errors/handle-errors";
import { useEscrowsMutations } from "./tanstack/useEscrowsMutations";

const useApproveMilestoneDialog = () => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingFlag = useEscrowUIBoundedStore(
    (state) => state.setIsChangingFlag,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const { approveMilestone } = useEscrowsMutations();

  const approveMilestoneSubmit = async (
    selectedEscrow: Escrow,
    milestone: MultiReleaseMilestone | SingleReleaseMilestone,
    index: number,
  ) => {
    setIsChangingFlag(true);

    try {
      await approveMilestone.mutateAsync({
        payload: {
          contractId: selectedEscrow?.contractId || "",
          milestoneIndex: index.toString(),
          approver: address,
        },
        type: selectedEscrow.type,
        address,
      });

      if (selectedEscrow && index !== null) {
        const updatedEscrow = {
          ...selectedEscrow,
          milestones: selectedEscrow.milestones.map(
            (milestone, milestoneIndex) =>
              milestoneIndex === index
                ? {
                    ...milestone,
                    ...("flags" in milestone
                      ? { flags: { ...milestone.flags, approved: true } }
                      : { approved: true }),
                  }
                : milestone,
          ),
        };
        setSelectedEscrow(updatedEscrow);
      }

      toast.success(
        `The Milestone ${milestone.description} has been approved.`,
      );
    } catch (err) {
      toast.error(handleError(err as AxiosError).message);
    } finally {
      setIsChangingFlag(false);
    }
  };

  return { approveMilestoneSubmit };
};

export default useApproveMilestoneDialog;
