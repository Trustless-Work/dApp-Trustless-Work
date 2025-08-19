import * as React from "react";
import { ChartConfig } from "@/ui/chart";

type VolumeTrend = {
  date: string;
  value: number;
}[];

export function useVolumeTrendChartData(data: VolumeTrend) {
  const chartConfig: ChartConfig = {
    date: { label: "Date" },
    value: { label: "Total Volume", color: "hsl(var(--chart-1))" },
  };

  const formatted = React.useMemo(() => data, [data]);

  const currencyFormatter = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return {
    chartConfig,
    formatted,
    currencyFormatter,
  };
}
