"use client";

import { cn } from "@/lib/utils";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { formatDate, formatInteger } from "./formater";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import { DashboardCard, DashboardCardSeparator } from "./dashboard-card";

type OrdersRow = Readonly<{
  date: string;
  orders: number;
}>;

type OrdersChartRow = OrdersRow & Readonly<{ isPeak: boolean }>;

/** Daily orders — Apr 14–May 13, 2026 (30 days); sum matches KPI “Orders” in stats (1,842). */
const ORDERS_LAST_30_DAYS = [
  { date: "2026-04-14", orders: 48 },
  { date: "2026-04-15", orders: 54 },
  { date: "2026-04-16", orders: 52 },
  { date: "2026-04-17", orders: 56 },
  { date: "2026-04-18", orders: 46 },
  { date: "2026-04-19", orders: 44 },
  { date: "2026-04-20", orders: 60 },
  { date: "2026-04-21", orders: 63 },
  { date: "2026-04-22", orders: 57 },
  { date: "2026-04-23", orders: 52 },
  { date: "2026-04-24", orders: 50 },
  { date: "2026-04-25", orders: 55 },
  { date: "2026-04-26", orders: 49 },
  { date: "2026-04-27", orders: 61 },
  { date: "2026-04-28", orders: 65 },
  { date: "2026-04-29", orders: 60 },
  { date: "2026-04-30", orders: 68 },
  { date: "2026-05-01", orders: 64 },
  { date: "2026-05-02", orders: 72 },
  { date: "2026-05-03", orders: 55 },
  { date: "2026-05-04", orders: 70 },
  { date: "2026-05-05", orders: 66 },
  { date: "2026-05-06", orders: 68 },
  { date: "2026-05-07", orders: 62 },
  { date: "2026-05-08", orders: 75 },
  { date: "2026-05-09", orders: 78 },
  { date: "2026-05-10", orders: 82 },
  { date: "2026-05-11", orders: 74 },
  { date: "2026-05-12", orders: 69 },
  { date: "2026-05-13", orders: 67 },
] as const satisfies readonly OrdersRow[];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const PEAK_FALLBACK = "—";

function peakDay(rows: readonly OrdersRow[]) {
  let max = Number.NEGATIVE_INFINITY;
  let peakDate = "";
  for (const row of rows) {
    if (row.orders > max) {
      max = row.orders;
      peakDate = row.date;
    }
  }
  return peakDate;
}

function buildChartRows(rows: readonly OrdersRow[]) {
  const peakDate = peakDay(rows);
  const chartRows: OrdersChartRow[] = rows.map((row) => ({
    ...row,
    isPeak: row.date === peakDate,
  }));
  return { peakDate, chartRows };
}

function getTotalOrders(rows: readonly OrdersRow[]) {
  return rows.reduce((sum, row) => sum + row.orders, 0);
}

const { peakDate: peakDateStatic, chartRows: chartRowsStatic } =
  buildChartRows(ORDERS_LAST_30_DAYS);
const peakRowStatic = chartRowsStatic.find((row) => row.isPeak);
const totalOrdersStatic = getTotalOrders(ORDERS_LAST_30_DAYS);

/** Horizontal overlap hides band-scale rounding + SVG antialiasing hairlines between neighbours. */
const BAR_BLEED_X = 0.75;
const BAR_FILL_GRAD_TOP_OPACITY = 0.45;
const BAR_FILL_GRAD_BOTTOM_OPACITY = 0.0;
const BAR_STROKE_FILL_OPACITY = 1;

type OrdersGradientBarProps = {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: OrdersRow;
  peakDate: string;
};

type PeakLabelContentProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  index?: number;
};

function renderPeakLabel({ x, y, width, index }: PeakLabelContentProps) {
  const row = typeof index === "number" ? chartRowsStatic[index] : undefined;
  if (
    !(
      row?.isPeak &&
      typeof x === "number" &&
      typeof y === "number" &&
      typeof width === "number"
    )
  ) {
    return null;
  }
  return (
    <text
      className="fill-foreground text-[11px] tabular-nums"
      textAnchor="middle"
      x={x + width / 2}
      y={y - 8}
    >
      {formatDate(row.date, "day-month")}
    </text>
  );
}

export function OrdersChart() {
  const peakOrdersLabel = peakRowStatic
    ? formatInteger(peakRowStatic.orders)
    : PEAK_FALLBACK;
  const peakDateLabel = peakRowStatic
    ? formatDate(peakRowStatic.date, "day-month")
    : PEAK_FALLBACK;

  return (
    <DashboardCard className="gap-4">
      <div className="flex items-start justify-between gap-2 md:pe-2">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-2xl tabular-nums tracking-tight">
            {formatInteger(totalOrdersStatic)}
          </span>
          <span className="text-pretty text-muted-foreground text-xs">
            Orders in the last 30 days
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex w-fit items-center gap-1 text-muted-foreground text-xs">
            <span>Peak</span>
            <span className="font-medium text-foreground tabular-nums">
              {peakOrdersLabel}
            </span>
            <span>on</span>
            <span className="font-medium text-foreground">{peakDateLabel}</span>
          </span>
          <DashboardCardSeparator />
          <div className="inline-flex items-center gap-1 text-xs">
            <Delta value={9.8}>
              <DeltaIcon filled variant="arrow" />
              <DeltaValue />
            </Delta>
            <span className="text-muted-foreground">over last 30 days</span>
          </div>
        </div>
      </div>
      <ChartContainer className={cn("aspect-16/5 w-full")} config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartRowsStatic}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <XAxis
            axisLine={false}
            dataKey="date"
            interval={4}
            tickFormatter={(value) => formatDate(String(value), "day-month")}
            tickLine={false}
            type="category"
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={8} width={36} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Bar
            dataKey="orders"
            fill="var(--color-orders)"
            name={chartConfig.orders.label}
            shape={(props) => (
              <OrdersGradientBar
                fill={props.fill}
                height={props.height}
                index={props.index}
                payload={props.payload}
                peakDate={peakDateStatic}
                width={props.width}
                x={props.x}
                y={props.y}
              />
            )}
          >
            <LabelList content={renderPeakLabel} dataKey="orders" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardCard>
  );
}

/** Gradient bar + top stroke cap (same pattern as `dashboard/8/peak-hours.tsx`); peak day uses solid foreground. */
function OrdersGradientBar({
  fill,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  index = 0,
  peakDate,
}: OrdersGradientBarProps) {
  const date = payload?.date ?? "";
  const isPeak = date === peakDate;
  const capColor = isPeak
    ? chartConfig.orders.color
    : (fill ?? chartConfig.orders.color);
  const gid = `orders-gradient-bar-${index}-${date}`;
  const strokeGid = `${gid}-stroke`;
  const bleed = BAR_BLEED_X;
  const bx = typeof x === "number" ? x - bleed / 2 : x;
  const bw = typeof width === "number" ? width + bleed : width;

  if (isPeak) {
    return (
      <rect
        fill={capColor}
        height={height}
        rx={4}
        ry={5}
        width={bw}
        x={bx}
        y={y}
      />
    );
  }

  return (
    <>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor={capColor}
            stopOpacity={BAR_FILL_GRAD_TOP_OPACITY}
          />
          <stop
            offset="100%"
            stopColor={capColor}
            stopOpacity={BAR_FILL_GRAD_BOTTOM_OPACITY}
          />
        </linearGradient>
        <linearGradient id={strokeGid} x1="0" x2="0" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor={capColor}
            stopOpacity={BAR_STROKE_FILL_OPACITY}
          />
          <stop
            offset="100%"
            stopColor={capColor}
            stopOpacity={BAR_FILL_GRAD_BOTTOM_OPACITY}
          />
        </linearGradient>
      </defs>
      <rect
        fill={`url(#${gid})`}
        height={height}
        rx={4}
        ry={5}
        stroke={`url(#${strokeGid})`}
        strokeWidth={0.5}
        width={bw}
        x={bx}
        y={y}
      />
    </>
  );
}
