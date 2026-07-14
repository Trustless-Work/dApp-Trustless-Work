"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { useLinkedAddressHighlight } from "@/features/escrows/hooks/useLinkedAddressHighlight";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { MilestoneActionsMenu } from "@/features/escrows/ui/detail/MilestoneActionsMenu";
import { MilestoneDetailsDialog } from "@/features/escrows/ui/detail/MilestoneDetailsDialog";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import { MilestoneFlagsBadges } from "@/features/escrows/ui/MilestoneFlagsBadges";
import { MilestoneStatusBadge } from "@/features/escrows/ui/MilestoneStatusBadge";
import {
  formatMilestoneApprovals,
  isSharedEscrowAddress,
} from "@/features/escrows/utils/escrow-display.helper";

type EscrowMilestone = StoredEscrow["milestones"][number];

const MilestoneField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="text-sm font-medium">{children}</div>
  </div>
);

type EscrowMilestoneCardProps = {
  escrow: StoredEscrow;
  milestone: EscrowMilestone;
  index: number;
  isMulti: boolean;
  symbol: string;
  getLinkedAddressProps: ReturnType<
    typeof useLinkedAddressHighlight
  >["getLinkedAddressProps"];
  receiverCounts: ReadonlyMap<string, number>;
};

export const EscrowMilestoneCard = ({
  escrow,
  milestone,
  index,
  isMulti,
  symbol,
  getLinkedAddressProps,
  receiverCounts,
}: EscrowMilestoneCardProps) => {
  const multiMilestone = isMulti ? (milestone as MultiReleaseMilestone) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
        <CardTitle className="flex min-w-0 items-start gap-2 text-base font-medium leading-snug">
          <span className="min-w-0 flex-1">
            <span className="text-muted-foreground">#{index + 1}</span>{" "}
            {milestone.description}
          </span>
          <MilestoneFlagsBadges
            milestone={milestone}
            hideEmpty
            className="mt-1.5"
          />
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          <MilestoneDetailsDialog
            escrow={escrow}
            milestone={milestone}
            milestoneIndex={index}
          />
          <MilestoneActionsMenu escrow={escrow} milestoneIndex={index} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MilestoneField label="Status">
          <MilestoneStatusBadge milestone={milestone} />
        </MilestoneField>
        <MilestoneField label="Approvals">
          {formatMilestoneApprovals(milestone)}
        </MilestoneField>
        {isMulti && multiMilestone ? (
          <>
            <MilestoneField label="Amount">
              <UsdcAmount
                amount={multiMilestone.amount}
                symbol={symbol}
                size="sm"
              />
            </MilestoneField>
            <MilestoneField label="Receiver">
              <EscrowCopyField
                value={multiMilestone.receiver}
                compact
                maxVisibleChars={18}
                {...getLinkedAddressProps(
                  multiMilestone.receiver,
                  isSharedEscrowAddress(
                    receiverCounts,
                    multiMilestone.receiver,
                  ),
                )}
              />
            </MilestoneField>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
