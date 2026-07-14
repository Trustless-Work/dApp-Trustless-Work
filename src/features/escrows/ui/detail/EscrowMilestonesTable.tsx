"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { useLinkedAddressHighlight } from "@/features/escrows/hooks/useLinkedAddressHighlight";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { EscrowMilestoneCard } from "@/features/escrows/ui/detail/EscrowMilestoneCard";
import { MilestoneActionsMenu } from "@/features/escrows/ui/detail/MilestoneActionsMenu";
import { MilestoneDetailsDialog } from "@/features/escrows/ui/detail/MilestoneDetailsDialog";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import { MilestoneFlagsBadges } from "@/features/escrows/ui/MilestoneFlagsBadges";
import { MilestoneStatusBadge } from "@/features/escrows/ui/MilestoneStatusBadge";
import {
  formatMilestoneApprovals,
  getAddressOccurrenceCounts,
  getEscrowAssetSymbol,
  isSharedEscrowAddress,
} from "@/features/escrows/utils/escrow-display.helper";
import { cn } from "@/lib/utils";

type EscrowMilestonesTableProps = {
  escrow: StoredEscrow;
};

const tableHeadClassName =
  "h-auto px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground";

const tableCellClassName = "px-5 py-5 align-middle";

export const EscrowMilestonesTable = ({
  escrow,
}: EscrowMilestonesTableProps) => {
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const symbol = getEscrowAssetSymbol(escrow);
  const { getLinkedAddressProps } = useLinkedAddressHighlight();

  const receiverCounts = useMemo(() => {
    if (!isMulti) {
      return new Map<string, number>();
    }

    const receivers = escrow.milestones.map(
      (milestone) => (milestone as MultiReleaseMilestone).receiver,
    );

    return getAddressOccurrenceCounts([{ addresses: receivers }]);
  }, [escrow.milestones, isMulti]);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Milestones</h2>
        <span className="text-sm text-muted-foreground">
          {escrow.milestones.length} total
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:hidden">
        {escrow.milestones.map((milestone, index) => (
          <EscrowMilestoneCard
            key={index}
            escrow={escrow}
            milestone={milestone}
            index={index}
            isMulti={isMulti}
            symbol={symbol}
            getLinkedAddressProps={getLinkedAddressProps}
            receiverCounts={receiverCounts}
          />
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(tableHeadClassName, "w-14")}>#</TableHead>
              <TableHead className={cn(tableHeadClassName, "w-[34%]")}>
                Description
              </TableHead>
              <TableHead className={tableHeadClassName}>Status</TableHead>
              {isMulti ? (
                <>
                  <TableHead className={cn(tableHeadClassName, "text-right")}>
                    Amount
                  </TableHead>
                  <TableHead className={cn(tableHeadClassName, "w-[20%]")}>
                    Receiver
                  </TableHead>
                </>
              ) : null}
              <TableHead className={cn(tableHeadClassName, "text-right")}>
                Approvals
              </TableHead>
              <TableHead className={cn(tableHeadClassName, "w-28 text-right")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {escrow.milestones.map((milestone, index) => {
              const multiMilestone = isMulti
                ? (milestone as MultiReleaseMilestone)
                : null;

              return (
                <TableRow key={index}>
                  <TableCell
                    className={cn(
                      tableCellClassName,
                      "text-sm font-medium text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className={cn(
                      tableCellClassName,
                      "max-w-xs whitespace-normal",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <p
                        className="min-w-0 flex-1 font-medium leading-snug"
                        title={milestone.description}
                      >
                        {milestone.description}
                      </p>
                      <MilestoneFlagsBadges
                        milestone={milestone}
                        hideEmpty
                        className="mt-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    <MilestoneStatusBadge milestone={milestone} />
                  </TableCell>
                  {isMulti && multiMilestone ? (
                    <>
                      <TableCell
                        className={cn(tableCellClassName, "text-right")}
                      >
                        <UsdcAmount
                          amount={multiMilestone.amount}
                          symbol={symbol}
                          size="sm"
                          className="justify-end"
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          tableCellClassName,
                          "min-w-[190px] whitespace-normal",
                        )}
                      >
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
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell
                    className={cn(
                      tableCellClassName,
                      "text-right tabular-nums text-muted-foreground",
                    )}
                  >
                    {formatMilestoneApprovals(milestone)}
                  </TableCell>
                  <TableCell className={cn(tableCellClassName, "text-right")}>
                    <div className="flex items-center justify-end gap-1">
                      <MilestoneDetailsDialog
                        escrow={escrow}
                        milestone={milestone}
                        milestoneIndex={index}
                      />
                      <MilestoneActionsMenu
                        escrow={escrow}
                        milestoneIndex={index}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
