"use client";

import type {
  ApproveAndReleaseMilestonesPayload,
  ApproveMilestonesPayload,
  ChangeMilestoneStatusPayload,
  EscrowType,
  FundEscrowPayload,
  MultiReleaseReleaseFundsPayload,
  MultiReleaseResolveDisputePayload,
  MultiReleaseStartDisputePayload,
  SendTransactionResponse,
  SingleReleaseReleaseFundsPayload,
  SingleReleaseResolveDisputePayload,
  SingleReleaseStartDisputePayload,
  SingleReleaseWithdrawRemainingFundsPayload,
  UpdateMultiReleaseEscrowPayload,
  UpdateSingleReleaseEscrowPayload,
} from "@trustless-work/escrow";
import {
  useApproveAndReleaseMilestones,
  useApproveMilestones,
  useChangeMilestoneStatus,
  useFundEscrow,
  useReleaseFunds,
  useResolveDispute,
  useStartDispute,
  useUpdateEscrow,
  useWithdrawRemainingFunds,
} from "@trustless-work/escrow";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  escrowDetailQueryKey,
  escrowsQueryKey,
} from "@/features/escrows/constants/escrow.constants";
import {
  localEscrowRepository,
  toStoredEscrow,
} from "@/features/escrows/services/escrow-repository";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { getEscrowErrorMessage } from "@/features/escrows/utils/escrow-error.helper";
import { playSound } from "@/lib/sounds";
import { useSignAndSend } from "@/features/escrows/hooks/useSignAndSend";
import { useWalletContext } from "@/providers/WalletProvider";

function persistEscrowResponse(
  walletAddress: string,
  response: SendTransactionResponse,
  existing?: StoredEscrow | null,
): StoredEscrow | null {
  const contractId = response.contractId ?? existing?.contractId;
  const escrow = response.escrow;

  if (!contractId || !escrow) {
    return null;
  }

  const stored = toStoredEscrow(escrow, contractId, existing);
  localEscrowRepository.upsert(walletAddress, stored);
  return stored;
}

export function useEscrowActions(contractId: string, escrowType: EscrowType) {
  const { walletAddress } = useWalletContext();
  const queryClient = useQueryClient();
  const { signAndSend, loading: signing } = useSignAndSend();
  const { fundEscrow } = useFundEscrow();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { approveMilestones } = useApproveMilestones();
  const { approveAndReleaseMilestones } = useApproveAndReleaseMilestones();
  const { releaseFunds, releaseMilestones } = useReleaseFunds();
  const { startDispute, disputeMilestones } = useStartDispute();
  const { resolveDispute } = useResolveDispute();
  const { withdrawRemainingFunds } = useWithdrawRemainingFunds();
  const { updateEscrow } = useUpdateEscrow();

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: escrowsQueryKey(walletAddress),
    });
    await queryClient.invalidateQueries({
      queryKey: escrowDetailQueryKey(contractId, walletAddress),
    });
  }, [contractId, queryClient, walletAddress]);

  const runAction = useCallback(
    async (
      action: () => Promise<SendTransactionResponse>,
      successMessage: string,
    ) => {
      if (!walletAddress) {
        toast.error("Connect your wallet to continue.");
        return null;
      }

      const existing = localEscrowRepository.getByContractId(
        contractId,
        walletAddress,
      );

      try {
        const response = await action();
        const stored = persistEscrowResponse(walletAddress, response, existing);

        if (!stored) {
          toast.error("Transaction submitted but escrow data was not returned.");
          return null;
        }

        await invalidate();
        toast.success(successMessage);
        return stored;
      } catch (error) {
        playSound("error");
        toast.error(getEscrowErrorMessage(error));
        return null;
      }
    },
    [contractId, invalidate, walletAddress],
  );

  const fund = useCallback(
    (payload: FundEscrowPayload) =>
      runAction(
        () => signAndSend(() => fundEscrow(payload, escrowType)),
        "Escrow funded successfully",
      ),
    [escrowType, fundEscrow, runAction, signAndSend],
  );

  const changeStatus = useCallback(
    (payload: ChangeMilestoneStatusPayload) =>
      runAction(
        () => signAndSend(() => changeMilestoneStatus(payload, escrowType)),
        "Milestone status updated",
      ),
    [changeMilestoneStatus, escrowType, runAction, signAndSend],
  );

  const approve = useCallback(
    (payload: ApproveMilestonesPayload) =>
      runAction(
        () => signAndSend(() => approveMilestones(payload, escrowType)),
        "Milestone approved",
      ),
    [approveMilestones, escrowType, runAction, signAndSend],
  );

  const approveAndRelease = useCallback(
    (payload: ApproveAndReleaseMilestonesPayload) =>
      runAction(
        () => signAndSend(() => approveAndReleaseMilestones(payload)),
        "Milestones approved and released",
      ),
    [approveAndReleaseMilestones, runAction, signAndSend],
  );

  const release = useCallback(
    (
      payload:
        | SingleReleaseReleaseFundsPayload
        | MultiReleaseReleaseFundsPayload,
    ) =>
      runAction(
        () => signAndSend(() => releaseFunds(payload, escrowType)),
        "Funds released successfully",
      ),
    [escrowType, releaseFunds, runAction, signAndSend],
  );

  const releaseBatch = useCallback(
    (payload: MultiReleaseReleaseFundsPayload) =>
      runAction(
        () => signAndSend(() => releaseMilestones(payload)),
        "Milestones released successfully",
      ),
    [releaseMilestones, runAction, signAndSend],
  );

  const dispute = useCallback(
    (
      payload:
        | SingleReleaseStartDisputePayload
        | MultiReleaseStartDisputePayload,
    ) =>
      runAction(
        () => signAndSend(() => startDispute(payload, escrowType)),
        "Dispute started",
      ),
    [escrowType, runAction, signAndSend, startDispute],
  );

  const disputeBatch = useCallback(
    (payload: MultiReleaseStartDisputePayload) =>
      runAction(
        () => signAndSend(() => disputeMilestones(payload)),
        "Milestones disputed",
      ),
    [disputeMilestones, runAction, signAndSend],
  );

  const resolve = useCallback(
    (
      payload:
        | SingleReleaseResolveDisputePayload
        | MultiReleaseResolveDisputePayload,
    ) =>
      runAction(
        () => signAndSend(() => resolveDispute(payload, escrowType)),
        "Dispute resolved",
      ),
    [escrowType, resolveDispute, runAction, signAndSend],
  );

  const withdraw = useCallback(
    (payload: SingleReleaseWithdrawRemainingFundsPayload) =>
      runAction(
        () => signAndSend(() => withdrawRemainingFunds(payload, escrowType)),
        "Remaining funds withdrawn",
      ),
    [escrowType, runAction, signAndSend, withdrawRemainingFunds],
  );

  const update = useCallback(
    (
      payload:
        | UpdateSingleReleaseEscrowPayload
        | UpdateMultiReleaseEscrowPayload,
    ) =>
      runAction(
        () => signAndSend(() => updateEscrow(payload, escrowType)),
        "Escrow updated successfully",
      ),
    [escrowType, runAction, signAndSend, updateEscrow],
  );

  return {
    fund,
    changeStatus,
    approve,
    approveAndRelease,
    release,
    releaseBatch,
    dispute,
    disputeBatch,
    resolve,
    withdraw,
    update,
    loading: signing,
    walletAddress,
  };
}
