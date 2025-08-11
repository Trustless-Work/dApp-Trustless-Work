"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import EscrowDetailDialog from "@/components/modules/escrow/ui/dialogs/EscrowDetailDialog";
import { useEscrowUIBoundedStore } from "@/components/modules/escrow/store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { getStatus } from "../../utils/escrow-status.util";
import NoData from "@/components/utils/ui/NoData";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import useNetwork from "@/hooks/useNetwork";

export const TopEscrowsTable = ({ escrows }: { escrows: Escrow[] }) => {
  const { t } = useTranslation();
  const { currentNetwork } = useNetwork();
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const hasData = escrows && escrows.length > 0;

  const { formatCurrency, formatDateFromFirebase } = useFormatUtils();

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
        <TableBody className="px-5">
          {hasData ? (
            escrows.map((escrow) => (
              <TableRow key={escrow.contractId}>
                <TableCell className="font-medium">{escrow.title}</TableCell>
                <TableCell className="text-center">
                  {formatCurrency(escrow.amount, escrow.trustline?.name)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{getStatus(escrow)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {formatDateFromFirebase(
                    escrow.createdAt._seconds,
                    escrow.createdAt._nanoseconds,
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {formatDateFromFirebase(
                    escrow.updatedAt._seconds,
                    escrow.updatedAt._nanoseconds,
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">
                          {t("dashboard.general.table.openMenu")}
                        </span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {t("dashboard.general.table.actions")}
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDialogOpen(true);
                          setSelectedEscrow(escrow);
                        }}
                      >
                        {t("dashboard.general.table.moreDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const escrowViewerUrl =
                            currentNetwork === "testnet"
                              ? `https://viewer.trustlesswork.com/${escrow.contractId}`
                              : `https://viewer.trustlesswork.com/${escrow.contractId}`;
                          window.open(escrowViewerUrl, "_blank");
                        }}
                      >
                        {t("dashboard.general.table.viewInViewer")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <NoData />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog */}
      <EscrowDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEscrow={setSelectedEscrow}
      />
    </div>
  );
};
