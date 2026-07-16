"use client";

import { curveMonotoneX } from "@visx/curve";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { DashboardVolumePoint } from "@/features/dashboard/types/dashboard.types";
import { Area, AreaChart } from "@/features/dashboard/charts/area-chart";
import { Grid } from "@/features/dashboard/charts/grid";
import { ChartTooltip } from "@/features/dashboard/charts/tooltip";
import { XAxis } from "@/features/dashboard/charts/x-axis";
import { YAxis } from "@/features/dashboard/charts/y-axis";
import { formatCompactCurrency } from "./formater";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

const REVENUE_COLOR = "var(--chart-2)";

type MorChartProps = {
  series: readonly DashboardVolumePoint[];
  latestVolume: number;
  deltaPct: number;
};

export function MorChart({ series, latestVolume, deltaPct }: MorChartProps) {
  const chartData = useMemo(
    () =>
      series.map((row) => ({ ...row })) as Record<string, unknown>[],
    [series],
  );

  const tooltipRows = useMemo(
    () => (point: Record<string, unknown>) => [
      {
        label: "Locked",
        value: formatCompactCurrency(point.volume as number),
        color: REVENUE_COLOR,
      },
    ],
    [],
  );

  return (
    <DashboardCard className="gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4 md:pe-4">
        <div className="flex flex-col items-start gap-1">
          <span className="font-semibold text-2xl tabular-nums">
            {formatCompactCurrency(latestVolume)}
          </span>
          <DashboardCardTitle>Locked volume</DashboardCardTitle>
        </div>

        <div className="inline-flex items-center gap-1 text-xs">
          <Delta value={deltaPct}>
            <DeltaIcon filled variant="arrow" />
            <DeltaValue />
          </Delta>
          <span className="text-muted-foreground">over last 30 days</span>
        </div>
      </div>
      <div
        className="w-full"
        style={
          {
            "--chart-crosshair": REVENUE_COLOR,
          } as CSSProperties
        }
      >
        <AreaChart
          className="aspect-auto h-60 w-full md:h-72"
          data={chartData}
          margin={{ top: 0, right: 28, bottom: 42, left: 32 }}
          xDataKey="date"
        >
          <Grid stroke="var(--border)" />
          <Area
            curve={curveMonotoneX}
            dataKey="volume"
            fadeEdges={true}
            fill={REVENUE_COLOR}
            stroke={REVENUE_COLOR}
            strokeWidth={2}
          />
          <XAxis numTicks={6} tickerHalfWidth={44} />
          <YAxis />
          <ChartTooltip rows={tooltipRows} />
        </AreaChart>
      </div>
    </DashboardCard>
  );
}
