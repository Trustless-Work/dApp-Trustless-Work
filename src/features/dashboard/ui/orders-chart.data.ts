import type { ChartConfig } from "@/components/ui/chart";

type OrdersRow = Readonly<{
  date: string;
  orders: number;
}>;

export type OrdersChartRow = OrdersRow & Readonly<{ isPeak: boolean }>;

/** Daily orders — Apr 14–May 13, 2026 (30 days); sum matches KPI “Orders” in stats (1,842). */
export const ORDERS_LAST_30_DAYS = [
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

export function getTotalOrders(rows: readonly OrdersRow[]) {
  return rows.reduce((sum, row) => sum + row.orders, 0);
}

export const { peakDate: peakDateStatic, chartRows: chartRowsStatic } =
  buildChartRows(ORDERS_LAST_30_DAYS);

export const peakRowStatic = chartRowsStatic.find((row) => row.isPeak);
export const totalOrdersStatic = getTotalOrders(ORDERS_LAST_30_DAYS);

export const ordersChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
