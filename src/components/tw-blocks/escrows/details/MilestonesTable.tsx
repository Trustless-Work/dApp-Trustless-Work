"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  formatAddress,
  formatCurrency,
} from "@/components/tw-blocks/helpers/format.helper";
import { MilestoneStatusBadge } from "./MilestoneStatusBadge";
import { useDisplayNameByAddress } from "@/hooks/useDisplayNameByAddress";

interface MilestonesTableProps {
  selectedEscrow: Escrow;
  onViewDetails: (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void;
}

const ReceiverCell = ({ receiver }: { receiver: string }) => {
  const { displayName } = useDisplayNameByAddress(receiver);
  const hasResolvedName = displayName !== "Without Name";

  return (
    <Link
      href={`/dashboard/public-profile/${receiver}`}
      target="_blank"
      className="text-sm text-primary hover:underline"
      title={receiver}
    >
      {hasResolvedName ? (
        <span className="flex flex-col">
          <span>{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {formatAddress(receiver)}
          </span>
        </span>
      ) : (
        formatAddress(receiver)
      )}
    </Link>
  );
};

export const MilestonesTable = ({
  selectedEscrow,
  onViewDetails,
}: MilestonesTableProps) => {
  const isMultiRelease = selectedEscrow.type === "multi-release";

  const getReceiver = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
  ): string | undefined => {
    if (isMultiRelease && "receiver" in milestone) {
      return (milestone as MultiReleaseMilestone).receiver;
    }
    return (selectedEscrow.roles as { receiver?: string })?.receiver;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="hidden sm:table-cell">Receiver</TableHead>
            {isMultiRelease && (
              <TableHead className="hidden md:table-cell">Amount</TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => {
            const receiver = getReceiver(milestone);

            return (
              <TableRow
                key={`milestone-row-${milestoneIndex}-${milestone.description}-${milestone.status}`}
              >
                <TableCell>
                  <span
                    className="max-w-[200px] truncate block"
                    title={milestone.description}
                  >
                    {milestone.description}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {receiver ? (
                    <ReceiverCell receiver={receiver} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                {isMultiRelease && (
                  <TableCell className="hidden md:table-cell">
                    {"amount" in milestone ? (
                      formatCurrency(
                        milestone.amount,
                        selectedEscrow.trustline?.symbol,
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <MilestoneStatusBadge milestone={milestone} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => onViewDetails(milestone, milestoneIndex)}
                  >
                    <Eye className="w-3 h-3 mr-2 flex-shrink-0" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
