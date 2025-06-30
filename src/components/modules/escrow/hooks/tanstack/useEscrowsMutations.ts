import { useMutation } from "@tanstack/react-query";
import {
  EscrowType,
  InitializeMultiReleaseEscrowPayload,
  InitializeSingleReleaseEscrowPayload,
  UpdateMultiReleaseEscrowPayload,
  UpdateSingleReleaseEscrowPayload,
  useInitializeEscrow,
  useUpdateEscrow,
} from "@trustless-work/escrow";

export const useEscrowsMutations = () => {
  const { deployEscrow } = useInitializeEscrow();
  const { updateEscrow } = useUpdateEscrow();

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
  });

  return {
    deployEscrow: deployEscrowMutation,
    updateEscrow: updateEscrowMutation,
  };
};
