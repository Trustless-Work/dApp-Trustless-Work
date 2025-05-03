import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStatusChartData } from "../../hooks/status-chart-data.hook";
import { PieChart, Pie, Cell } from "recharts";
import { MilestoneDashboardData } from "../../@types/dashboard.entity";
import NoData from "@/components/utils/ui/NoData";

interface MilestoneStatusChartProps {
  data: MilestoneDashboardData["milestoneStatusCounts"];
}

export function MilestoneStatusChart({ data }: MilestoneStatusChartProps) {
  const { formattedData, chartConfig, total } = useStatusChartData(data);
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Milestone Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ChartContainer config={chartConfig}>
            {hasData ? (
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <NoData />
              </div>
            )}
          </ChartContainer>
        </div>
        {hasData && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {formattedData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ml-auto font-medium">
                  {((item.count / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
