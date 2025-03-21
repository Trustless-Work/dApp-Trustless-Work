"use client";

import { useEscrowStore } from "@/core/store/data/escrow-store";
import { formatCurrency, formatMonthYear } from "@/utils/format-utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EscrowVolumeChart() {
  const volumeTrends = useEscrowStore((state) => state.volumeTrends);
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
          Failed to load volume data: {trendsError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!volumeTrends.length) {
    return <div className="text-center py-8">No volume data available</div>;
  }

  // Format data for chart
  const chartData = volumeTrends.map((item) => ({
    ...item,
    month: formatMonthYear(item.date),
  }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis
            className="text-xs"
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Volume"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.3}
            name="Escrow Volume"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
