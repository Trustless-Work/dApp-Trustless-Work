"use client";

import {
  Line,
  LineChart,
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
import { useReleaseTrendChartData } from "../../hooks/release-trend-chart-data.hook";
import NoData from "@/components/utils/ui/NoData";
import { SkeletonEscrowReleaseTrendChart } from "../utils/SkeletonEscrowReleaseTrendChart";
import { useTranslation } from "react-i18next";

type ReleaseTrend = {
  month: string;
  count: number;
}[];

interface EscrowReleaseTrendChartProps {
  data: ReleaseTrend;
  isLoading?: boolean;
}

export const EscrowReleaseTrendChart = ({
  data,
  isLoading = false,
}: EscrowReleaseTrendChartProps) => {
  const { t } = useTranslation();
  const { chartConfig, formatted } = useReleaseTrendChartData(data);
  const hasData = data && data.length > 0;

  if (isLoading) {
    return <SkeletonEscrowReleaseTrendChart />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.sections.general.releaseTrend.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <NoData />
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
