"use client";

import { useEscrowsMutations } from "../tanstack/useEscrowsMutations";
import { useGlobalAuthenticationStore, useGlobalBoundedStore } from "@/store/data";
import { SingleReleaseResolveDisputePayload } from "@trustless-work/escrow";

export const useResolveDisputeSingle = () => {
  const { resolveDispute } = useEscrowsMutations();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const onSubmitSingle = async (
    distributions: { address: string; amount: number | string }[],
  ): Promise<{ address: string; amount: number }[]> => {
    if (!selectedEscrow) throw new Error("No escrow selected");

    const normalizedDistributions = distributions.map((d) => ({
      address: d.address,
      amount: typeof d.amount === "string" ? Number(d.amount) : d.amount,
    }));

    const payload: SingleReleaseResolveDisputePayload = {
      contractId: selectedEscrow.contractId || "",
      disputeResolver: selectedEscrow.roles?.disputeResolver,
      distributions: normalizedDistributions as [{ address: string; amount: number }],
    };

    await resolveDispute.mutateAsync({
      payload,
      type: "single-release",
      address,
    });

    return normalizedDistributions;
  };

  return { onSubmitSingle };
};