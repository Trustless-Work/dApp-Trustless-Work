import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useReleaseTrendChartData } from "../../hooks/release-trend-chart-data.hook"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts"
import { MilestoneDashboardData } from "../../@types/dashboard.entity"

interface MilestoneApprovalTrendChartProps {
    data: MilestoneDashboardData["milestoneApprovalTrend"]
}

export function MilestoneApprovalTrendChart({ data }: MilestoneApprovalTrendChartProps) {
    const { chartConfig, formatted } = useReleaseTrendChartData(data)

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Milestone Approval Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[240px]">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formatted} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(value) => {
                                        const [year, month] = value.split("-")
                                        return `${month}/${year.slice(2)}`
                                    }}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="count" stroke="var(--color-count)" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
