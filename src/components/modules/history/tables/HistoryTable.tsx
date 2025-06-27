"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFormatUtils } from "@/utils/hook/format.hook";
import NoData from "@/components/utils/ui/NoData";
import { useEscrowUIBoundedStore } from "@/components/modules/escrow/store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import { HistoryItem } from "../@types/history.entity";
import { getHistoryTableColumns } from "../constants/table-columns.constant";

interface HistoryTableProps {
  data: HistoryItem[];
  isLoading?: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

const HistoryTable = ({
  data,
  isLoading = false,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage,
}: HistoryTableProps) => {
  const { t } = useTranslation();
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const { formatDateFromFirebase, formatDollar, formatAddress } =
    useFormatUtils();
  const columns = getHistoryTableColumns();

  const getStatusBadge = (escrow: HistoryItem) => {
    if (escrow.flags?.released) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Released
        </Badge>
      );
    }
    if (escrow.flags?.resolved) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Resolved
        </Badge>
      );
    }
    if (escrow.flags?.disputed) {
      return <Badge variant="destructive">Disputed</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-3">
        <div className="rounded-lg p-3">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3">
      {data.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id}>{column.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((escrow: HistoryItem) => (
                  <TableRow key={escrow.id} className="animate-fade-in">
                    <TableCell className="font-medium">
                      {escrow.title || t("history.table.noTitle")}
                    </TableCell>
                    <TableCell>
                      {escrow.description || t("history.table.noDescription")}
                    </TableCell>
                    <TableCell>{formatDollar(escrow.amount)}</TableCell>
                    <TableCell>{formatDollar(escrow.balance || 0)}</TableCell>
                    <TableCell>{getStatusBadge(escrow)}</TableCell>
                    <TableCell>
                      {formatAddress(escrow.roles?.serviceProvider)}
                    </TableCell>
                    <TableCell>
                      {formatAddress(escrow.roles?.approver)}
                    </TableCell>
                    <TableCell>
                      {formatDateFromFirebase(
                        escrow.createdAt.seconds,
                        escrow.createdAt.nanoseconds,
                      )}
                    </TableCell>
                    <TableCell>
                      {escrow.lastActivity
                        ? formatDateFromFirebase(Number(escrow.lastActivity), 0)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">
                              {t("history.table.dropdown.openMenu")}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {t("history.table.dropdown.label")}
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setIsDialogOpen(true);
                              setSelectedEscrow(escrow);
                            }}
                          >
                            {t("history.table.dropdown.moreDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              window.open(
                                `https://viewer.trustlesswork.com/${escrow.contractId}`,
                                "_blank",
                              );
                            }}
                          >
                            {t("history.table.dropdown.viewViewer")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center gap-4 mt-10 mb-3 px-3">
            <div className="flex items-center gap-2">
              <span>{t("history.table.pagination.itemsPerPage")}</span>
              <Input
                type="number"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-16"
              />
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t("history.table.pagination.previous")}
            </Button>
            <span>
              {t("history.table.pagination.pageOf", {
                currentPage,
                totalPages,
              })}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t("history.table.pagination.next")}
            </Button>
          </div>
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default HistoryTable;
