"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useVolumeTrendChartData } from "../../hooks/use-volume-trend-chart-data.hook";

type VolumeTrend = {
  date: string;
  value: number;
}[];

export function EscrowVolumeTrendChart({ data }: { data: VolumeTrend }) {
  const { chartConfig, formatted, currencyFormatter } =
    useVolumeTrendChartData(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow Volume Trend</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={currencyFormatter}
              />
              <ChartTooltip
                formatter={currencyFormatter}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
