import type { ChartConfig } from "@/components/ui/chart";
import type { DashboardCreatedPoint } from "@/features/dashboard/types/dashboard.types";

export type OrdersChartRow = DashboardCreatedPoint;

export function getTotalOrders(rows: readonly { orders: number }[]) {
  return rows.reduce((sum, row) => sum + row.orders, 0);
}

export const ordersChartConfig = {
  orders: {
    label: "Escrows",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
