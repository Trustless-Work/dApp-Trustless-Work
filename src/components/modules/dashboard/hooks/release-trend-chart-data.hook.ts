import * as React from "react";
import { ChartConfig } from "@/components/ui/chart";

type ReleaseTrend = {
  month: string;
  count: number;
}[];

export function useReleaseTrendChartData(data: ReleaseTrend) {
  const chartConfig: ChartConfig = {
    month: {
      label: "Date",
    },
    count: {
      label: "Releases",
      color: "hsl(var(--chart-1))",
    },
  };

  const formatted = React.useMemo(() => data, [data]);

  return {
    chartConfig,
    formatted,
  };
}
