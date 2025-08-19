import * as React from "react";
import { ChartConfig } from "@/ui/chart";
import { getStatusColor } from "../../../utils/escrow-status.util";

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
      data.map((item) => ({
        ...item,
        fill: getStatusColor(item.name),
      })),
    [data],
  );

  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      data.map((item) => [
        item.name.toLowerCase(),
        {
          label: item.name,
          color: getStatusColor(item.name),
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
