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
import { useTopEscrowTableData } from "../../hooks/use-top-escrow-table-data.hook";
import type { Escrow } from "@/@types/escrow.entity";

type Props = {
  data: Escrow[];
};

export function TopEscrowsList({ data }: Props) {
  const rows = useTopEscrowTableData(data);

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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={row.badgeVariant}>{row.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{row.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
