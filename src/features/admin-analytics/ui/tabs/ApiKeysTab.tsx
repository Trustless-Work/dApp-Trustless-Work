"use client";

import { useState } from "react";
import { KeyIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoData } from "@/components/shared/NoData";
import {
  DashboardCard,
  DashboardCardTitle,
} from "@/components/dashboard/dashboard-card";
import { formatInteger } from "@/helpers/chart-format.helper";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import type { ApiKeysTopBy } from "@/features/admin-analytics/types/analytics-v2.types";
import {
  useApiKeyDetail,
  useApiKeysSummary,
  useApiKeysTop,
} from "@/features/admin-analytics/hooks/useAdminAnalytics";
import { formatOrganizationName } from "@/features/admin-analytics/utils/revenue.util";
import { formatRequestCount } from "@/features/admin-analytics/utils/api-keys.util";
import { ApiKeysTabSkeleton } from "@/features/admin-analytics/ui/tabs/ApiKeysTabSkeleton";
import {
  ApiKeysSummaryStats,
  UsageTrackedBanner,
} from "@/features/admin-analytics/ui/api-keys/ApiKeysSummaryStats";
import { ApiKeyDetailSheet } from "@/features/admin-analytics/ui/api-keys/ApiKeyDetailSheet";

type ApiKeysTabProps = {
  range: AnalyticsRange;
  topBy: ApiKeysTopBy;
};

export const ApiKeysTab = ({ range, topBy }: ApiKeysTabProps) => {
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  const summaryQuery = useApiKeysSummary(range);
  const topQuery = useApiKeysTop(range, topBy);
  const detailQuery = useApiKeyDetail(range, selectedKeyId);

  if (summaryQuery.isPending) {
    return <ApiKeysTabSkeleton />;
  }

  const summary = summaryQuery.data;
  const topItems = topQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <UsageTrackedBanner since={summary?.usageTrackedSince ?? null} />

      {summary ? <ApiKeysSummaryStats summary={summary} /> : null}

      <DashboardCard className="gap-4">
        <DashboardCardTitle>Top API keys</DashboardCardTitle>

        {topBy !== "requests" ? (
          <p className="text-muted-foreground text-xs">
            Revenue, volume, and escrow metrics are platform-level — all keys
            under one organization share the same figures. Revenue and volume
            produce the same ranking order.
          </p>
        ) : null}

        {topItems.length === 0 ? (
          <NoData
            icon={KeyIcon}
            title="No API keys"
            description="No keys match the selected range and ranking."
          />
        ) : (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {topItems.map((item) => (
                <Card
                  key={item.key.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedKeyId(item.key.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {item.key.description ?? item.key.id}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">
                      {formatOrganizationName(item.organization)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {topBy === "requests" && item.requestCount ? (
                      <p className="text-sm tabular-nums">
                        {formatRequestCount(item.requestCount)} requests
                      </p>
                    ) : (
                      <p className="text-sm tabular-nums">
                        {item.escrowCount ?? 0} escrows
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="text-right">Metric</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topItems.map((item) => (
                    <TableRow
                      key={item.key.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedKeyId(item.key.id)}
                    >
                      <TableCell>
                        {item.key.description ?? truncateKeyId(item.key.id)}
                      </TableCell>
                      <TableCell>
                        {formatOrganizationName(item.organization)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {topBy === "requests" && item.requestCount
                          ? formatRequestCount(item.requestCount)
                          : formatInteger(item.escrowCount ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </DashboardCard>

      <ApiKeyDetailSheet
        data={detailQuery.data}
        isLoading={detailQuery.isPending}
        open={Boolean(selectedKeyId)}
        usageTrackedSince={summary?.usageTrackedSince ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedKeyId(null);
          }
        }}
      />
    </div>
  );
};

function truncateKeyId(value: string): string {
  if (value.length <= 16) {
    return value;
  }
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}
