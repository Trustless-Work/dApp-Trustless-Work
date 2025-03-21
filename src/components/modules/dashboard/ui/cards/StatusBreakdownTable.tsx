"use client";

import { useEscrowStore } from "@/core/store/data/escrow-store";
import { getStatusColor } from "@/utils/color-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatusBreakdownTable() {
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

  // Sort by count descending
  const sortedStatusCounts = [...statusCounts].sort(
    (a, b) => b.count - a.count,
  );

  // Calculate total for percentage
  const total = statusCounts.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Count</TableHead>
          <TableHead className="text-right">Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStatusCounts.map((item) => (
          <TableRow key={item.status}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                />
                <span>{item.status}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">{item.count}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {((item.count / total) * 100).toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
