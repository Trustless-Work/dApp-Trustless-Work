"use client";

import {
  BadgeCheck,
  CircleDollarSign,
  Gavel,
  ListChecks,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEscrowActionPolicy } from "@/features/escrows/hooks/useEscrowActionPolicy";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { ApproveAndReleaseAction } from "@/features/escrows/ui/actions/ApproveAndReleaseAction";
import { ApproveMilestoneAction } from "@/features/escrows/ui/actions/ApproveMilestoneAction";
import { ChangeMilestoneStatusAction } from "@/features/escrows/ui/actions/ChangeMilestoneStatusAction";
import { ReleaseFundsAction } from "@/features/escrows/ui/actions/ReleaseFundsAction";
import { ResolveDisputeAction } from "@/features/escrows/ui/actions/ResolveDisputeAction";
import { StartDisputeAction } from "@/features/escrows/ui/actions/StartDisputeAction";
import {
  formatBatchActionCountLabel,
  getEligibleMilestoneIndexes,
} from "@/features/escrows/utils/milestone-batch.helper";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type MilestoneBatchToolbarProps = {
  escrow: StoredEscrow;
  selectedIndexes: readonly number[];
  onClear: () => void;
};

export const MilestoneBatchToolbar = ({
  escrow,
  selectedIndexes,
  onClear,
}: MilestoneBatchToolbarProps) => {
  const policy = useEscrowActionPolicy(escrow);
  const reduceMotion = useReducedMotion();
  const hasSelection = selectedIndexes.length > 0;

  const approveIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "approve",
  );
  const changeStatusIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "changeStatus",
  );
  const releaseIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "release",
  );
  const approveAndReleaseIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "approveAndRelease",
  );
  const disputeIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "dispute",
  );
  const resolveIndexes = getEligibleMilestoneIndexes(
    policy,
    selectedIndexes,
    "resolve",
  );

  const hasActions =
    approveIndexes.length > 0 ||
    changeStatusIndexes.length > 0 ||
    releaseIndexes.length > 0 ||
    approveAndReleaseIndexes.length > 0 ||
    disputeIndexes.length > 0 ||
    resolveIndexes.length > 0;

  return (
    <AnimatePresence initial={false}>
      {hasSelection ? (
        <motion.div
          key="milestone-batch-actions"
          initial={
            reduceMotion ? false : { opacity: 0, y: -6, height: 0 }
          }
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -4, height: 0 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: EASE_OUT }
          }
          className="overflow-hidden"
        >
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">
                {selectedIndexes.length} selected
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={onClear}
              >
                Clear
              </Button>
            </div>

            {hasActions ? (
              <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">
                {approveIndexes.length > 0 ? (
                  <ApproveMilestoneAction
                    escrow={escrow}
                    milestoneIndexes={approveIndexes}
                    compact
                    icon={BadgeCheck}
                    label={formatBatchActionCountLabel(
                      "Approve",
                      approveIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
                {changeStatusIndexes.length > 0 ? (
                  <ChangeMilestoneStatusAction
                    escrow={escrow}
                    milestoneIndexes={changeStatusIndexes}
                    compact
                    icon={ListChecks}
                    label={formatBatchActionCountLabel(
                      "Update Status",
                      changeStatusIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
                {approveAndReleaseIndexes.length > 0 ? (
                  <ApproveAndReleaseAction
                    escrow={escrow}
                    milestoneIndexes={approveAndReleaseIndexes}
                    compact
                    triggerVariant="primary"
                    icon={Zap}
                    label={formatBatchActionCountLabel(
                      "Approve & Release",
                      approveAndReleaseIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
                {releaseIndexes.length > 0 ? (
                  <ReleaseFundsAction
                    escrow={escrow}
                    milestoneIndexes={releaseIndexes}
                    compact
                    triggerVariant="primary"
                    icon={CircleDollarSign}
                    label={formatBatchActionCountLabel(
                      "Release",
                      releaseIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
                {disputeIndexes.length > 0 ? (
                  <StartDisputeAction
                    escrow={escrow}
                    milestoneIndexes={disputeIndexes}
                    compact
                    triggerVariant="danger"
                    icon={ShieldAlert}
                    label={formatBatchActionCountLabel(
                      "Dispute",
                      disputeIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
                {resolveIndexes.length > 0 ? (
                  <ResolveDisputeAction
                    escrow={escrow}
                    milestoneIndexes={resolveIndexes}
                    compact
                    icon={Gavel}
                    label={formatBatchActionCountLabel(
                      "Resolve",
                      resolveIndexes.length,
                    )}
                    onSuccess={onClear}
                  />
                ) : null}
              </div>
            ) : (
              <span className="ml-auto text-sm text-muted-foreground">
                No batch actions for this selection
              </span>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
