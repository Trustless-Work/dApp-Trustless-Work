"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonTopEscrowsTable = () => {
  return (
    <div className="container mx-auto py-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Updated</TableHead>
            <TableHead className="text-start">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[60px] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-[80px] mx-auto rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[90px] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[90px] mx-auto" />
              </TableCell>
              <TableCell className="text-start">
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
