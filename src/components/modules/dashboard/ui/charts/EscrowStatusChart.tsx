"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStatusChartData } from "../../hooks/status-chart-data.hook";

type StatusCounts = {
  name: string;
  count: number;
}[];

export function EscrowStatusChart({ data }: { data: StatusCounts }) {
  const { total, formattedData, chartConfig } = useStatusChartData(data);

  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Escrow Status</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox) return null;
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {total}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy + 20}
                        className="fill-muted-foreground text-sm"
                      >
                        Total
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center gap-4 w-full">
          {formattedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className="text-sm font-medium">{entry.name}</span>
              <span className="text-sm text-muted-foreground">
                {entry.count}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
