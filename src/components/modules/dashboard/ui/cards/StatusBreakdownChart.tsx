"use client";

import { useEscrowStore } from "@/core/store/data/escrow-store";
import { getStatusColor } from "@/utils/color-utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EscrowStatus } from "@/@types/escrow-section.entity";

export function StatusBreakdownChart() {
  const statusCounts = useEscrowStore((state) => state.statusCounts);
  const isLoading = useEscrowStore((state) => state.isLoading);
  const error = useEscrowStore((state) => state.error);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load status breakdown: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!statusCounts.length) {
    return <div className="text-center py-8">No escrow data available</div>;
  }

  // Prepare data for the pie chart
  const chartData = statusCounts.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getStatusColor(entry.name as EscrowStatus)}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} escrows`, "Count"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
