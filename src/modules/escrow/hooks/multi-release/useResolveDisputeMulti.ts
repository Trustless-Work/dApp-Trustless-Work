"use client";

import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/store/data";
import { MultiReleaseResolveDisputePayload } from "@trustless-work/escrow";

export const useResolveDisputeMulti = () => {
  const { resolveDispute } = useEscrowsMutations();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const onSubmitMulti = async (
    distributions: { address: string; amount: number | string }[],
    milestoneIndex: number,
  ): Promise<{ address: string; amount: number }[]> => {
    if (!selectedEscrow) throw new Error("No escrow selected");

    const normalizedDistributions = distributions.map((d) => ({
      address: d.address,
      amount: typeof d.amount === "string" ? Number(d.amount) : d.amount,
    }));

    const payload: MultiReleaseResolveDisputePayload = {
      contractId: selectedEscrow.contractId || "",
      disputeResolver: selectedEscrow.roles?.disputeResolver,
      milestoneIndex: Number(milestoneIndex).toString(),
      distributions: normalizedDistributions as [
        { address: string; amount: number },
      ],
    };

    await resolveDispute.mutateAsync({
      payload,
      type: "multi-release",
      address,
    });

    return normalizedDistributions;
  };

  return { onSubmitMulti };
};
