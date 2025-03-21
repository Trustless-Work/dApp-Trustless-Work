"use client";

import { useEscrowStore } from "@/core/store/data/escrow-store";
import { formatMonthYear } from "@/utils/format-utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EscrowTrendsChart() {
  const releaseTrends = useEscrowStore((state) => state.releaseTrends);
  const trendsLoading = useEscrowStore((state) => state.trendsLoading);
  const trendsError = useEscrowStore((state) => state.trendsError);

  if (trendsLoading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  if (trendsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load trend data: {trendsError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!releaseTrends.length) {
    return <div className="text-center py-8">No trend data available</div>;
  }

  // Calculate average for reference line
  const average =
    releaseTrends.reduce((sum, item) => sum + item.value, 0) /
    releaseTrends.length;

  // Format data for chart
  const chartData = releaseTrends.map((item) => ({
    ...item,
    month: formatMonthYear(item.date),
  }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis
            className="text-xs"
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip
            formatter={(value: number) => [`${value} escrows`, "Released"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <ReferenceLine
            y={average}
            stroke="#FF9800"
            strokeDasharray="3 3"
            label={{
              value: "Average",
              position: "insideBottomRight",
              className: "text-xs fill-muted-foreground",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2196F3"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Released Escrows"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
