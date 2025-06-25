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
import { useTranslation } from "react-i18next";

export const SkeletonTopEscrowsTable = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.general.table.title")}</TableHead>
            <TableHead className="text-center">
              {t("dashboard.general.table.amount")}
            </TableHead>
            <TableHead className="text-center">
              {t("dashboard.general.table.status")}
            </TableHead>
            <TableHead className="text-center">
              {t("dashboard.general.table.created")}
            </TableHead>
            <TableHead className="text-center">
              {t("dashboard.general.table.updated")}
            </TableHead>
            <TableHead className="text-start">
              {t("dashboard.general.table.actions")}
            </TableHead>
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
