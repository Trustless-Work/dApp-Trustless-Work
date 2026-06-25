"use client";

import { curveMonotoneX } from "@visx/curve";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Area, AreaChart } from "@/features/dashboard/charts/area-chart";
import { Grid } from "@/features/dashboard/charts/grid";
import { ChartTooltip } from "@/features/dashboard/charts/tooltip";
import { XAxis } from "@/features/dashboard/charts/x-axis";
import { YAxis } from "@/features/dashboard/charts/y-axis";
import { formatCompactCurrency } from "./formater";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

type MorPoint = {
	date: string;
	mrr: number;
};

/** Hardcoded 30-day MRR demo (~$72k–$91k): choppy net growth within that band. */
const MRR_GROWTH_30_DAYS: readonly MorPoint[] = [
	{ date: "2026-04-11", mrr: 72_363 },
	{ date: "2026-04-12", mrr: 72_000 },
	{ date: "2026-04-13", mrr: 74_093 },
	{ date: "2026-04-14", mrr: 74_773 },
	{ date: "2026-04-15", mrr: 70_157 },
	{ date: "2026-04-16", mrr: 75_979 },
	{ date: "2026-04-17", mrr: 77_329 },
	{ date: "2026-04-18", mrr: 77_720 },
	{ date: "2026-04-19", mrr: 76_604 },
	{ date: "2026-04-20", mrr: 78_222 },
	{ date: "2026-04-21", mrr: 79_533 },
	{ date: "2026-04-22", mrr: 78_668 },
	{ date: "2026-04-23", mrr: 76_157 },
	{ date: "2026-04-24", mrr: 76_966 },
	{ date: "2026-04-25", mrr: 78_696 },
	{ date: "2026-04-26", mrr: 78_836 },
	{ date: "2026-04-27", mrr: 80_844 },
	{ date: "2026-04-28", mrr: 80_454 },
	{ date: "2026-04-29", mrr: 81_347 },
	{ date: "2026-04-30", mrr: 82_295 },
	{ date: "2026-05-01", mrr: 83_300 },
	{ date: "2026-05-02", mrr: 85_755 },
	{ date: "2026-05-03", mrr: 80_388 },
	{ date: "2026-05-04", mrr: 85_364 },
	{ date: "2026-05-05", mrr: 86_982 },
	{ date: "2026-05-06", mrr: 87_094 },
	{ date: "2026-05-07", mrr: 86_173 },
	{ date: "2026-05-08", mrr: 88_034 },
	{ date: "2026-05-09", mrr: 89_488 },
	{ date: "2026-05-10", mrr: 92_200 },
] as const;

const REVENUE_COLOR = "var(--chart-2)";

function periodGrowthPct(rows: readonly MorPoint[]) {
	const first = rows[0];
	const last = rows.at(-1);
	if (!(first && last) || first.mrr === 0) {
		return 0;
	}
	return ((last.mrr - first.mrr) / first.mrr) * 100;
}

export function MorChart() {
	const chartData = useMemo(
		() =>
			MRR_GROWTH_30_DAYS.map((row) => ({ ...row })) as Record<
				string,
				unknown
			>[],
		[]
	);
	const latestMrr = MRR_GROWTH_30_DAYS.at(-1)?.mrr ?? 0;
	const rangeTrend = periodGrowthPct(MRR_GROWTH_30_DAYS);

	const tooltipRows = useMemo(
		() => (point: Record<string, unknown>) => [
			{
				label: "MRR",
				value: formatCompactCurrency(point.mrr as number),
				color: REVENUE_COLOR,
			},
		],
		[]
	);

	return (
		<DashboardCard className="gap-6">
			<div className="flex flex-wrap items-end justify-between gap-4 md:pe-4">
				<div className="flex flex-col items-start gap-1">
					<span className="font-semibold text-2xl tabular-nums">
						{formatCompactCurrency(latestMrr)}
					</span>
					<DashboardCardTitle>Monthly recurring revenue</DashboardCardTitle>
				</div>

				<div className="inline-flex items-center gap-1 text-xs">
					<Delta value={rangeTrend}>
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
						dataKey="mrr"
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
