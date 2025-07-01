import { queryClient } from "@/lib/react-query-client";
import { useMutation } from "@tanstack/react-query";
import {
  EscrowType,
  FundEscrowPayload,
  InitializeMultiReleaseEscrowPayload,
  InitializeSingleReleaseEscrowPayload,
  UpdateMultiReleaseEscrowPayload,
  UpdateSingleReleaseEscrowPayload,
  useFundEscrow,
  useInitializeEscrow,
  useUpdateEscrow,
  ChangeMilestoneStatusPayload,
  useChangeMilestoneStatus,
  ApproveMilestonePayload,
  useApproveMilestone,
} from "@trustless-work/escrow";

export const useEscrowsMutations = () => {
  const { deployEscrow } = useInitializeEscrow();
  const { updateEscrow } = useUpdateEscrow();
  const { fundEscrow } = useFundEscrow();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { approveMilestone } = useApproveMilestone();

  const deployEscrowMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload:
        | InitializeSingleReleaseEscrowPayload
        | InitializeMultiReleaseEscrowPayload;
      type: EscrowType;
    }) => deployEscrow(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateEscrowMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload:
        | UpdateSingleReleaseEscrowPayload
        | UpdateMultiReleaseEscrowPayload;
      type: EscrowType;
    }) => updateEscrow(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const fundEscrowMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload: FundEscrowPayload;
      type: EscrowType;
    }) => fundEscrow(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const changeMilestoneStatusMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload: ChangeMilestoneStatusPayload;
      type: EscrowType;
    }) => changeMilestoneStatus(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const approveMilestoneMutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload: ApproveMilestonePayload;
      type: EscrowType;
    }) => approveMilestone(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    deployEscrow: deployEscrowMutation,
    updateEscrow: updateEscrowMutation,
    fundEscrow: fundEscrowMutation,
    changeMilestoneStatus: changeMilestoneStatusMutation,
    approveMilestone: approveMilestoneMutation,
  };
};
