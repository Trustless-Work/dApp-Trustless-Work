"use client";

import { useEscrowStore } from "@/core/store/data/escrow-store";
import { formatCurrency, formatDate } from "@/utils/format-utils";
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
import { getStatusColor } from "@/utils/color-utils";

export function TopEscrowsTable() {
  const topEscrows = useEscrowStore((state) => state.topEscrows);
  const isLoading = useEscrowStore((state) => state.isLoading);
  const error = useEscrowStore((state) => state.error);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load top escrows: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!topEscrows.length) {
    return <div className="text-center py-8">No escrow data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Parties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topEscrows.map((escrow) => (
            <TableRow key={escrow.id}>
              <TableCell className="font-medium">{escrow.title}</TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span>From: {escrow.parties.sender.name}</span>
                  <span>To: {escrow.parties.receiver.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="text-white"
                  style={{ backgroundColor: getStatusColor(escrow.status) }}
                >
                  {escrow.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(escrow.createdAt)}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(escrow.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
