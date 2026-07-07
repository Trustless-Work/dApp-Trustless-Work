"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MilestoneActionsMenu } from "@/features/escrows/ui/detail/MilestoneActionsMenu";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import { MilestoneStatusBadge } from "@/features/escrows/ui/MilestoneStatusBadge";
import {
  formatMilestoneApprovals,
  getAddressOccurrenceCounts,
  getEscrowAssetSymbol,
  getMilestoneDisplayStatus,
  isSharedEscrowAddress,
} from "@/features/escrows/utils/escrow-display.helper";
import { cn } from "@/lib/utils";

type EscrowMilestonesTableProps = {
  escrow: StoredEscrow;
};

type EscrowMilestone = StoredEscrow["milestones"][number];

const tableHeadClassName =
  "h-auto px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground";

const tableCellClassName = "px-5 py-5 align-middle";

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

type MilestoneRowProps = {
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

const MilestoneCard = ({
  escrow,
  milestone,
  index,
  isMulti,
  symbol,
  getLinkedAddressProps,
  receiverCounts,
}: MilestoneRowProps) => {
  const displayStatus = getMilestoneDisplayStatus(milestone);
  const multiMilestone = isMulti ? (milestone as MultiReleaseMilestone) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
        <CardTitle className="text-base font-medium leading-snug">
          <span className="text-muted-foreground">#{index + 1}</span>{" "}
          {milestone.description}
        </CardTitle>
        <MilestoneActionsMenu escrow={escrow} milestoneIndex={index} />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MilestoneField label="Status">
          <MilestoneStatusBadge status={displayStatus} />
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
          <MilestoneCard
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

      <div className="mt-6 hidden md:block">
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
                  <TableHead className={cn(tableHeadClassName, "w-[26%]")}>
                    Receiver
                  </TableHead>
                </>
              ) : null}
              <TableHead className={cn(tableHeadClassName, "text-right")}>
                Approvals
              </TableHead>
              <TableHead className={cn(tableHeadClassName, "w-16 text-right")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {escrow.milestones.map((milestone, index) => {
              const displayStatus = getMilestoneDisplayStatus(milestone);
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
                    <p
                      className="font-medium leading-snug"
                      title={milestone.description}
                    >
                      {milestone.description}
                    </p>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    <MilestoneStatusBadge status={displayStatus} />
                  </TableCell>
                  {isMulti && multiMilestone ? (
                    <>
                      <TableCell className={cn(tableCellClassName, "text-right")}>
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
                    <div className="flex justify-end">
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
