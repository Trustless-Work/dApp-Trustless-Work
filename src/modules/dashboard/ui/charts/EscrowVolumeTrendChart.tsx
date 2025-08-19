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
} from "@/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import { useVolumeTrendChartData } from "../../hooks/useVolumeTrendChartData";
import NoData from "@/shared/utils/NoData";
import { SkeletonEscrowVolumeTrendChart } from "../utils/SkeletonEscrowVolumeTrendChart";
import { useTranslation } from "react-i18next";

type VolumeTrend = {
  date: string;
  value: number;
}[];

interface EscrowVolumeTrendChartProps {
  data: VolumeTrend;
  isLoading?: boolean;
}

export const EscrowVolumeTrendChart = ({
  data,
  isLoading = false,
}: EscrowVolumeTrendChartProps) => {
  const { t } = useTranslation();
  const { chartConfig, formatted, currencyFormatter } =
    useVolumeTrendChartData(data);
  const hasData = data && data.length > 0;

  if (isLoading) {
    return <SkeletonEscrowVolumeTrendChart />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.sections.general.volumeTrend.title")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.sections.general.volumeTrend.desc")}
        </CardDescription>
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
              <NoData />
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
