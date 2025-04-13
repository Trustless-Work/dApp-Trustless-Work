// src/components/modules/dashboard/ui/lists/TopEscrowsList.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Escrow = {
  id: string;
  title: string;
  amount: string;
  createdAt: {
    seconds: number;
  };
  releaseFlag: boolean;
  disputeFlag: boolean;
  resolvedFlag: boolean;
};

type Props = {
  data: Escrow[];
};

function getStatus(escrow: Escrow): string {
  if (escrow.releaseFlag) return "Released";
  if (escrow.disputeFlag) return "Disputed";
  if (escrow.resolvedFlag) return "Resolved";
  return "Pending";
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Released":
      return "default";
    case "Disputed":
      return "destructive";
    case "Resolved":
      return "secondary";
    default:
      return "outline";
  }
}

export function TopEscrowsList({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Escrows by Value</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((escrow) => {
              const status = getStatus(escrow);
              const variant = getStatusVariant(status);
              const date = format(
                new Date(escrow.createdAt.seconds * 1000),
                "dd MMM yyyy",
              );
              const amount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(parseFloat(escrow.amount));

              return (
                <TableRow key={escrow.id}>
                  <TableCell className="font-medium">{escrow.title}</TableCell>
                  <TableCell className="text-right">{amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={variant}>{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
