"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatGrid } from "@/components/dashboard/stat-grid";
import {
  DashboardCard,
  DashboardCardSeparator,
  DashboardCardTitle,
} from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";
import { formatInteger } from "@/helpers/chart-format.helper";
import { formatAssetAmount } from "@/helpers/format.helper";
import { formatPeriodKey } from "@/helpers/period-key.helper";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import {
  useRevenueByToken,
  useRevenueEvents,
} from "@/features/admin-analytics/hooks/useAdminAnalytics";
import { resolveResponseGranularity } from "@/features/admin-analytics/utils/analytics-range.util";
import { CategoryFeeLineChart } from "@/features/admin-analytics/ui/charts/CategoryFeeLineChart";
import { DonutChart } from "@/features/admin-analytics/ui/charts/DonutChart";
import { RevenueAssetAmount } from "@/features/admin-analytics/ui/RevenueAssetAmount";
import { RevenueEventsTable, RevenueEventTypeFilter } from "@/features/admin-analytics/ui/RevenueEventsTable";
import {
  buildCategoryDonutSlices,
  buildCategoryLineSeries,
  buildRevenueChartSeries,
  buildRevenueStatSummaries,
  buildTokenDonutSlices,
  formatEventTypeLabel,
  formatFeeBpsPercent,
  hasUnresolvedAssets,
  resolveAssetSymbol,
} from "@/features/admin-analytics/utils/revenue.util";
import type { RevenueEventType } from "@/features/admin-analytics/types/analytics.types";
import { RevenueTabSkeleton } from "@/features/admin-analytics/ui/tabs/RevenueTabSkeleton";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const EVENTS_PAGE_SIZE = 25;

type RevenueTabProps = {
  range: AnalyticsRange;
};

export const RevenueTab = ({ range }: RevenueTabProps) => {
  const [eventsOffset, setEventsOffset] = useState(0);
  const [eventType, setEventType] = useState<RevenueEventType | undefined>();

  const query = useRevenueByToken(range);
  const eventsQuery = useRevenueEvents(range, {
    limit: EVENTS_PAGE_SIZE,
    offset: eventsOffset,
    eventType,
  });

  const buckets = useMemo(
    () => query.data?.data ?? [],
    [query.data?.data],
  );
  const granularity = resolveResponseGranularity(
    query.data?.granularity,
    range.granularity,
  );

  const chartSeries = useMemo(
    () => buildRevenueChartSeries(buckets),
    [buckets],
  );
  const categoryLineSeries = useMemo(
    () => buildCategoryLineSeries(buckets),
    [buckets],
  );
  const statSummaries = useMemo(
    () => buildRevenueStatSummaries(buckets),
    [buckets],
  );
  const categorySlices = useMemo(
    () => buildCategoryDonutSlices(buckets, CHART_COLORS),
    [buckets],
  );
  const tokenSlices = useMemo(
    () => buildTokenDonutSlices(buckets, CHART_COLORS),
    [buckets],
  );

  const tokenKeys = useMemo(
    () => [...new Set(buckets.map((bucket) => resolveAssetSymbol(bucket.asset)))],
    [buckets],
  );

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        tokenKeys.map((token, index) => [
          token,
          {
            label: token,
            color: CHART_COLORS[index % CHART_COLORS.length],
          },
        ]),
      ),
    [tokenKeys],
  );

  const stats = useMemo(() => {
    const tokenStats = statSummaries.map((summary) => ({
      label: summary.label,
      value:
        summary.key === "other" || summary.displayAsset === null ? (
          <span className="font-medium text-2xl tabular-nums tracking-tight">
            {formatAssetAmount(Number(summary.totalFee))}
            {!summary.resolved ? (
              <span className="text-muted-foreground text-xs"> *</span>
            ) : null}
          </span>
        ) : (
          <RevenueAssetAmount
            amount={summary.totalFee}
            asset={summary.displayAsset}
            emphasis
            size="2xl"
          />
        ),
      delta: null,
      hint: summary.resolved ? "platform take" : "scale unverified",
    }));

    const metaStats = [];

    if (query.data?.feeBps !== undefined) {
      metaStats.push({
        label: "Platform fee rate",
        value: formatFeeBpsPercent(query.data.feeBps),
        delta: null,
        hint: "on released volume",
      });
    }

    metaStats.push({
      label: "Revenue events",
      value: eventsQuery.isPending
        ? "—"
        : formatInteger(eventsQuery.data?.pagination.total ?? 0),
      delta: null,
      hint: eventType
        ? `${formatEventTypeLabel(eventType)} only`
        : "in selected range",
    });

    return [...tokenStats, ...metaStats];
  }, [
    eventType,
    eventsQuery.data?.pagination.total,
    eventsQuery.isPending,
    query.data,
    statSummaries,
  ]);

  const statColumns: 2 | 3 | 4 | 5 =
    stats.length >= 5
      ? 5
      : stats.length >= 4
        ? 4
        : stats.length === 3
          ? 3
          : 2;

  const handleEventTypeChange = useCallback((next?: RevenueEventType) => {
    setEventType(next);
    setEventsOffset(0);
  }, []);

  useEffect(() => {
    setEventsOffset(0);
  }, [range.granularity, range.periods]);

  if (query.isPending) {
    return <RevenueTabSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      {query.errorMessage ? (
        <p className="text-pretty text-muted-foreground text-sm">
          {query.errorMessage}
        </p>
      ) : null}

      {hasUnresolvedAssets(buckets) ? (
        <Badge variant="outline">* unresolved token decimals</Badge>
      ) : null}

      {stats.length > 0 ? (
        <StatGrid columns={statColumns} stats={stats} />
      ) : null}

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          "lg:grid-cols-[.68fr_.32fr] xl:grid-cols-[.70fr_.30fr]",
        )}
      >
        <div className="flex flex-col gap-4">
          <DashboardCard className="gap-4">
            <DashboardCardTitle>Platform take by token</DashboardCardTitle>
            <ChartContainer className="aspect-16/5 w-full" config={chartConfig}>
              <BarChart accessibilityLayer data={chartSeries}>
                <XAxis
                  axisLine={false}
                  dataKey="period"
                  tickFormatter={(value) =>
                    formatPeriodKey(String(value), granularity, "short")
                  }
                  tickLine={false}
                />
                <YAxis axisLine={false} tickLine={false} width={48} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        formatPeriodKey(String(value), granularity, "full")
                      }
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {tokenKeys.map((token) => (
                  <Bar
                    key={token}
                    dataKey={token}
                    fill={`var(--color-${token})`}
                    stackId="revenue"
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </DashboardCard>

          <DashboardCardSeparator />
          <DashboardCard className="gap-4">
            <DashboardCardTitle>Released vs resolve fees</DashboardCardTitle>
            <CategoryFeeLineChart
              data={categoryLineSeries}
              granularity={granularity}
            />
          </DashboardCard>
        </div>

        <div className="relative flex flex-col gap-4">
          <DashboardCardSeparator
            className="absolute inset-y-0 -left-2 hidden h-full w-px lg:block"
            orientation="vertical"
          />
          <DashboardCardSeparator className="block lg:hidden" />

          <DashboardCard className="gap-4">
            <DashboardCardTitle>Fee mix by category</DashboardCardTitle>
            <DonutChart
              emptyDescription="No fee revenue in the selected range."
              emptyTitle="No category split"
              slices={categorySlices}
            />
          </DashboardCard>

          <DashboardCard className="gap-4">
            <DashboardCardTitle>Fee share by token</DashboardCardTitle>
            <DonutChart
              emptyDescription="No token fees in the selected range."
              emptyTitle="No token split"
              slices={tokenSlices}
            />
          </DashboardCard>
        </div>
      </div>

      <DashboardCardSeparator />

      <DashboardCard className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DashboardCardTitle>Revenue ledger</DashboardCardTitle>
          <RevenueEventTypeFilter
            value={eventType ?? "all"}
            onChange={handleEventTypeChange}
          />
        </div>
        {eventsQuery.errorMessage ? (
          <p className="text-pretty text-muted-foreground text-sm">
            {eventsQuery.errorMessage}
          </p>
        ) : null}
        <RevenueEventsTable
          events={eventsQuery.data?.data ?? []}
          isLoading={eventsQuery.isPending}
          limit={EVENTS_PAGE_SIZE}
          offset={eventsOffset}
          total={eventsQuery.data?.pagination.total ?? 0}
          onPageChange={setEventsOffset}
        />
      </DashboardCard>
    </div>
  );
};
