import * as React from "react";
import { ChartConfig } from "@/components/ui/chart";

type StatusCounts = {
  name: string;
  count: number;
}[];

export function useStatusChartData(data: StatusCounts) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data],
  );

  const formattedData = React.useMemo(
    () =>
      data.map((item, i) => ({
        ...item,
        fill: `hsl(var(--chart-${i + 1}))`,
      })),
    [data],
  );

  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      data.map((item, i) => [
        item.name.toLowerCase(),
        {
          label: item.name,
          color: `hsl(var(--chart-${i + 1}))`,
        },
      ]),
    ) as ChartConfig;
  }, [data]);

  return {
    total,
    formattedData,
    chartConfig,
  };
}
