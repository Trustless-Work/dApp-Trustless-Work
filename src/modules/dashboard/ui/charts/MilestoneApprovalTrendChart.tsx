import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import { useReleaseTrendChartData } from "../../hooks/useReleaseTrendChartData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { MilestoneDashboardData } from "../../types/dashboard.entity";
import NoData from "@/shared/utils/NoData";

interface MilestoneApprovalTrendChartProps {
  data: MilestoneDashboardData["milestoneApprovalTrend"];
}

export const MilestoneApprovalTrendChart = ({
  data,
}: MilestoneApprovalTrendChartProps) => {
  const { chartConfig, formatted } = useReleaseTrendChartData(data);
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Milestone Approval Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100px">
              <LineChart
                data={formatted}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return `${month}/${year.slice(2)}`;
                  }}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  activeDot={{ r: 8 }}
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
