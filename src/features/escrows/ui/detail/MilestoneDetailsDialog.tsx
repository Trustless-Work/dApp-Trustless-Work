"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CircleDollarSign,
  FileText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  getMilestoneApprovalCount,
  getMilestoneApprovalsTarget,
  getMilestoneDisputeReason,
  getMilestoneEvidence,
  getMilestoneFlags,
  hasMilestoneDetailAttachments,
  hasMilestoneDisputeState,
  type EscrowMilestone,
} from "@/features/escrows/utils/escrow-milestone.helper";
import { cn } from "@/lib/utils";

type MilestoneDetailsDialogProps = {
  escrow: StoredEscrow;
  milestone: EscrowMilestone;
  milestoneIndex: number;
};

const DetailField = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="text-sm font-medium">{children}</div>
  </div>
);

const DetailTile = ({
  label,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex min-h-24 flex-col justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4",
      className,
    )}
  >
    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </div>
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
  const flags = getMilestoneFlags(milestone);
  const showDispute = isMulti && hasMilestoneDisputeState(milestone);
  const disputeReason = showDispute
    ? getMilestoneDisputeReason(milestone)
    : "";
  const hasAttachments = hasMilestoneDetailAttachments(milestone, {
    includeDispute: isMulti,
  });
  const approvedBy = getMilestoneApprovedBy(milestone);
  const approvalCount = getMilestoneApprovalCount(milestone);
  const approvalsTarget = getMilestoneApprovalsTarget(milestone);
  const symbol = getEscrowAssetSymbol(escrow);
  const attachmentCount = [evidence, disputeReason].filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <FileText className="size-4" aria-hidden="true" />
          Details
          {hasAttachments ? (
            <Badge
              variant="secondary"
              className="ml-1 h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]"
            >
              {attachmentCount}
            </Badge>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-2xl">
        <div className="overflow-y-auto">
          <div className="border-b border-border bg-muted/30 p-6 pr-12">
            <DialogHeader className="gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                  <Badge variant="outline" className="w-fit uppercase">
                    Milestone #{milestoneIndex + 1}
                  </Badge>
                  <DialogTitle className="text-xl leading-tight">
                    Milestone details
                  </DialogTitle>
                  <DialogDescription>
                    Review milestone status, approvals, receiver, and supporting
                    information.
                  </DialogDescription>
                </div>
                <MilestoneStatusBadge milestone={milestone} />
              </div>

              {flags.length > 0 ? (
                <MilestoneFlagsBadges
                  milestone={milestone}
                  appearance="badge"
                  hideEmpty
                />
              ) : null}
            </DialogHeader>
          </div>

          <div className="flex flex-col gap-5 p-6">
            <section className="rounded-2xl border border-border bg-card/60 p-4">
              <DetailField label="Description">
                <p className="whitespace-pre-wrap break-words font-normal leading-relaxed text-foreground">
                  {milestone.description}
                </p>
              </DetailField>
            </section>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailTile
                label="Approvals"
                icon={BadgeCheck}
                className={cn(!isMulti && "sm:col-span-2")}
              >
                <div className="flex flex-col gap-1">
                  <span className="tabular-nums">
                    {formatMilestoneApprovals(milestone)}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {approvalCount} of {approvalsTarget} signatures collected
                  </span>
                </div>
              </DetailTile>

              {isMulti && multiMilestone ? (
                <DetailTile label="Amount" icon={CircleDollarSign}>
                  <UsdcAmount
                    amount={multiMilestone.amount}
                    symbol={symbol}
                    size="sm"
                  />
                </DetailTile>
              ) : null}

              {isMulti && multiMilestone ? (
                <DetailTile
                  label="Receiver"
                  icon={UserRound}
                  className="sm:col-span-2"
                >
                  <EscrowCopyField
                    value={multiMilestone.receiver}
                    compact
                    maxVisibleChars={32}
                  />
                </DetailTile>
              ) : null}
            </div>

            {approvedBy.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card/60 p-4">
                <DetailField label="Approved by">
                  <ul className="grid gap-2 sm:grid-cols-2">
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
              </section>
            ) : null}

            {evidence ? (
              <section className="rounded-2xl border border-border bg-card/60 p-4">
                <EscrowLongTextBlock label="Evidence" value={evidence} />
              </section>
            ) : null}

            {showDispute && multiMilestone?.dispute ? (
              <section className="flex flex-col gap-3 rounded-2xl border border-border bg-destructive/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <ShieldAlert className="size-3.5" aria-hidden="true" />
                    Dispute
                  </span>
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
              </section>
            ) : null}

            {!hasAttachments && approvedBy.length === 0 ? (
              <section className="rounded-2xl border border-border bg-muted/30 p-4">
                <DetailField label="Supporting information">
                  <span className="font-normal text-muted-foreground">
                    No evidence, dispute reason, or approver addresses have been
                    recorded for this milestone yet.
                  </span>
                </DetailField>
              </section>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
