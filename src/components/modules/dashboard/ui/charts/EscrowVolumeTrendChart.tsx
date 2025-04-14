"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useVolumeTrendChartData } from "../../hooks/use-volume-trend-chart-data.hook";
import { CalendarOffIcon as BarChartOff } from "lucide-react";

type VolumeTrend = {
  date: string;
  value: number;
}[];

export function EscrowVolumeTrendChart({ data }: { data: VolumeTrend }) {
  const { chartConfig, formatted, currencyFormatter } =
    useVolumeTrendChartData(data);
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow Volume Trend</CardTitle>
        <CardDescription>Amounts at each date</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {hasData ? (
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
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <BarChartOff className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No data available</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There is no escrow volume data to display at this time.
              </p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
