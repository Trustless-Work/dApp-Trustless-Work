"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import { EscrowLongTextBlock } from "@/features/escrows/ui/detail/EscrowLongTextBlock";
import { MilestoneFlagsBadges } from "@/features/escrows/ui/MilestoneFlagsBadges";
import { MilestoneStatusBadge } from "@/features/escrows/ui/MilestoneStatusBadge";
import {
  formatMilestoneApprovals,
  getEscrowAssetSymbol,
} from "@/features/escrows/utils/escrow-display.helper";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import {
  getMilestoneApprovedBy,
  getMilestoneDisputeReason,
  getMilestoneEvidence,
  getMilestoneFlags,
  getMilestoneStatusText,
  hasMilestoneDetailAttachments,
  hasMilestoneDisputeState,
  type EscrowMilestone,
} from "@/features/escrows/utils/escrow-milestone.helper";

type MilestoneDetailsDialogProps = {
  escrow: StoredEscrow;
  milestone: EscrowMilestone;
  milestoneIndex: number;
};

const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="text-sm font-medium">{children}</div>
  </div>
);

export const MilestoneDetailsDialog = ({
  escrow,
  milestone,
  milestoneIndex,
}: MilestoneDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const multiMilestone = isMulti
    ? (milestone as MultiReleaseMilestone)
    : null;
  const evidence = getMilestoneEvidence(milestone);
  const statusText = getMilestoneStatusText(milestone);
  const flags = getMilestoneFlags(milestone);
  const showDispute = isMulti && hasMilestoneDisputeState(milestone);
  const disputeReason = showDispute
    ? getMilestoneDisputeReason(milestone)
    : "";
  const hasAttachments = hasMilestoneDetailAttachments(milestone, {
    includeDispute: isMulti,
  });
  const approvedBy = getMilestoneApprovedBy(milestone);
  const symbol = getEscrowAssetSymbol(escrow);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          Details
          {hasAttachments ? (
            <Badge
              variant="secondary"
              className="ml-1 h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]"
            >
              {[evidence, disputeReason].filter(Boolean).length}
            </Badge>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Milestone {milestoneIndex + 1}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <DetailField label="Description">
            <p className="whitespace-pre-wrap break-words font-normal leading-relaxed">
              {milestone.description}
            </p>
          </DetailField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {statusText ? (
              <DetailField label="Status">
                <MilestoneStatusBadge milestone={milestone} />
              </DetailField>
            ) : null}
            {flags.length > 0 ? (
              <DetailField label="Flags">
                <MilestoneFlagsBadges
                  milestone={milestone}
                  appearance="badge"
                  hideEmpty
                />
              </DetailField>
            ) : null}
            <DetailField label="Approvals">
              <span className="tabular-nums text-muted-foreground">
                {formatMilestoneApprovals(milestone)}
              </span>
            </DetailField>
            {isMulti && multiMilestone ? (
              <DetailField label="Amount">
                <UsdcAmount
                  amount={multiMilestone.amount}
                  symbol={symbol}
                  size="sm"
                />
              </DetailField>
            ) : null}
          </div>

          {isMulti && multiMilestone ? (
            <DetailField label="Receiver">
              <EscrowCopyField
                value={multiMilestone.receiver}
                compact
                maxVisibleChars={24}
              />
            </DetailField>
          ) : null}

          {approvedBy.length > 0 ? (
            <DetailField label="Approved by">
              <ul className="flex flex-col gap-2">
                {approvedBy.map((address) => (
                  <li key={address}>
                    <EscrowCopyField
                      value={address}
                      compact
                      maxVisibleChars={24}
                    />
                  </li>
                ))}
              </ul>
            </DetailField>
          ) : null}

          {evidence ? (
            <EscrowLongTextBlock label="Evidence" value={evidence} />
          ) : null}

          {showDispute && multiMilestone?.dispute ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Dispute</span>
                {multiMilestone.dispute.isDisputed ? (
                  <Badge variant="destructive" className="uppercase">
                    Open
                  </Badge>
                ) : null}
                {multiMilestone.dispute.resolved ? (
                  <Badge variant="secondary" className="uppercase">
                    Resolved
                  </Badge>
                ) : null}
              </div>
              {disputeReason ? (
                <EscrowLongTextBlock label="Reason" value={disputeReason} />
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
