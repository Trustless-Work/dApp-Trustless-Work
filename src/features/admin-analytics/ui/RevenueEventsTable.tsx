"use client";

import Link from "next/link";
import { ReceiptIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoData } from "@/components/shared/NoData";
import useNetwork from "@/hooks/useNetwork";
import { formatIsoDateTime } from "@/helpers/format.helper";
import {
  getStellarExpertTransactionUrl,
  getTrustlessWorkViewerUrl,
} from "@/helpers/escrow-explorer.helper";
import type { NetworkType } from "@/types/network.entity";
import type {
  RevenueEvent,
  RevenueEventType,
} from "@/features/admin-analytics/types/analytics.types";
import { RevenueAssetAmount } from "@/features/admin-analytics/ui/RevenueAssetAmount";
import { RevenueEventsTableSkeleton } from "@/features/admin-analytics/ui/RevenueEventsTableSkeleton";
import {
  formatEventTypeLabel,
  formatOrganizationName,
} from "@/features/admin-analytics/utils/revenue.util";

type RevenueEventsTableProps = {
  events: readonly RevenueEvent[];
  total: number;
  limit: number;
  offset: number;
  isLoading?: boolean;
  onPageChange: (offset: number) => void;
};

function truncateId(value: string): string {
  if (value.length <= 12) {
    return value;
  }
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function eventRowKey(event: RevenueEvent, index: number): string {
  return `${event.escrowId}-${event.createdAt}-${index}`;
}

function revenueEventTypeBadgeVariant(
  eventType: RevenueEventType,
): VariantProps<typeof badgeVariants>["variant"] {
  return eventType === "release" ? "success" : "secondary";
}

const RevenueEventTypeBadge = ({
  eventType,
}: {
  eventType: RevenueEventType;
}) => (
  <Badge variant={revenueEventTypeBadgeVariant(eventType)}>
    {formatEventTypeLabel(eventType)}
  </Badge>
);

const ExplorerLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    className="text-primary text-xs hover:underline"
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {label}
  </Link>
);

const RevenueEventCard = ({
  event,
  network,
}: {
  event: RevenueEvent;
  network: NetworkType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
      <div className="min-w-0 space-y-1">
        <CardTitle className="truncate font-mono text-sm">
          <ExplorerLink
            href={getTrustlessWorkViewerUrl(network, event.escrowId)}
            label={truncateId(event.escrowId)}
          />
        </CardTitle>
        <p className="text-muted-foreground text-xs">
          {formatIsoDateTime(event.createdAt)}
        </p>
      </div>
      <RevenueEventTypeBadge eventType={event.eventType} />
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">Organization</span>
        <span className="text-sm">
          {formatOrganizationName(event.organization)}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">Engagement</span>
        <span className="text-sm">{event.engagementId ?? "—"}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">Released</span>
        <RevenueAssetAmount amount={event.amount} asset={event.asset} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">Fee</span>
        <RevenueAssetAmount amount={event.feeAmount} asset={event.asset} />
      </div>
      {event.txHash ? (
        <div className="col-span-2 flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Transaction</span>
          <ExplorerLink
            href={getStellarExpertTransactionUrl(network, event.txHash)}
            label="View on Stellar Expert"
          />
        </div>
      ) : null}
    </CardContent>
  </Card>
);

export const RevenueEventsTable = ({
  events,
  total,
  limit,
  offset,
  isLoading = false,
  onPageChange,
}: RevenueEventsTableProps) => {
  const { currentNetwork } = useNetwork();
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  if (isLoading) {
    return <RevenueEventsTableSkeleton />;
  }

  if (events.length === 0) {
    return (
      <NoData
        icon={ReceiptIcon}
        title="No revenue events"
        description="No ledger rows match the selected range and filters."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:hidden">
        {events.map((event, index) => (
          <RevenueEventCard
            key={eventRowKey(event, index)}
            event={event}
            network={currentNetwork}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Escrow</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Released</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={eventRowKey(event, index)}>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {formatIsoDateTime(event.createdAt)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <ExplorerLink
                    href={getTrustlessWorkViewerUrl(
                      currentNetwork,
                      event.escrowId,
                    )}
                    label={truncateId(event.escrowId)}
                  />
                </TableCell>
                <TableCell>
                  <RevenueEventTypeBadge eventType={event.eventType} />
                </TableCell>
                <TableCell>
                  {formatOrganizationName(event.organization)}
                </TableCell>
                <TableCell className="text-right">
                  <RevenueAssetAmount
                    align="right"
                    amount={event.amount}
                    asset={event.asset}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <RevenueAssetAmount
                    align="right"
                    amount={event.feeAmount}
                    asset={event.asset}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {event.txHash ? (
                    <ExplorerLink
                      href={getStellarExpertTransactionUrl(
                        currentNetwork,
                        event.txHash,
                      )}
                      label="View"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs tabular-nums">
          {total} events · page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            disabled={!canPrev}
            size="sm"
            variant="outline"
            onClick={() => onPageChange(Math.max(0, offset - limit))}
          >
            Previous
          </Button>
          <Button
            disabled={!canNext}
            size="sm"
            variant="outline"
            onClick={() => onPageChange(offset + limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const RevenueEventTypeFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (eventType?: RevenueEventType) => void;
}) => {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === "all") {
          onChange(undefined);
          return;
        }
        if (next === "release" || next === "resolve_dispute") {
          onChange(next);
        }
      }}
    >
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue placeholder="Event type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All event types</SelectItem>
        <SelectItem value="release">Release</SelectItem>
        <SelectItem value="resolve_dispute">Resolve</SelectItem>
      </SelectContent>
    </Select>
  );
};
