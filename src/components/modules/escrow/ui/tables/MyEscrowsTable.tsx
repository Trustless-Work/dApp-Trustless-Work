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
import {
  CircleAlert,
  CircleCheckBig,
  Handshake,
  MoreHorizontal,
  TriangleAlert,
} from "lucide-react";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import NoData from "@/components/utils/ui/NoData";
import { useEscrowUIBoundedStore } from "../../store/ui";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import ExpandableContent from "./expandable/ExpandableContent";
import SuccessDialog, {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "../dialogs/SuccessDialog";
import SkeletonTable from "../utils/SkeletonTable";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Escrow } from "@/@types/escrow.entity";
import {
  MultiReleaseMilestone,
  Role,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useNetwork from "@/hooks/useNetwork";

interface MyEscrowsTableProps {
  role: Role;
}

const MyEscrowsTable = ({ role }: MyEscrowsTableProps) => {
  const { t } = useTranslation();
  const { currentNetwork } = useNetwork();
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const isSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessDialogOpen,
  );
  const setIsSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const isSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessReleaseDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const isSuccessResolveDisputeDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessResolveDisputeDialogOpen,
  );
  const setIsSuccessResolveDisputeDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessResolveDisputeDialogOpen,
  );
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const recentEscrow = useGlobalBoundedStore((state) => state.recentEscrow);

  const {
    escrows,
    currentPage,
    itemsPerPage,
    itemsPerPageOptions,
    totalPages,
    totalItems,
    isLoading,
    expandedRows,
    setItemsPerPage,
    setCurrentPage,
    toggleRowExpansion,
  } = useMyEscrows({ role });

  const { formatDateFromFirebase, formatAddress } = useFormatUtils();

  return (
    <div className="container mx-auto py-3" id="step-3">
      {isLoading ? (
        <SkeletonTable />
      ) : escrows.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("myEscrows.table.headers.title")}</TableHead>
                  <TableHead>
                    {t("myEscrows.table.headers.description")}
                  </TableHead>
                  <TableHead>{t("myEscrows.table.headers.balance")}</TableHead>
                  <TableHead>
                    {t("myEscrows.table.headers.engagement")}
                  </TableHead>
                  <TableHead>
                    {t("myEscrows.table.headers.serviceProvider")}
                  </TableHead>
                  <TableHead>{t("myEscrows.table.headers.approver")}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{t("myEscrows.table.headers.created")}</TableHead>
                  <TableHead>{t("myEscrows.table.headers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrows.map((escrow: Escrow) => {
                  // todo: use these constants in zusntand
                  const completedMilestones = escrow.milestones.filter(
                    (milestone) => milestone.status === "completed",
                  ).length;

                  const approvedMilestones = escrow.milestones.filter(
                    (
                      milestone: SingleReleaseMilestone | MultiReleaseMilestone,
                    ) =>
                      "flags" in milestone &&
                      milestone.flags?.approved === true,
                  ).length;

                  const totalMilestones = escrow.milestones.length;

                  const progressPercentageCompleted =
                    totalMilestones > 0
                      ? (completedMilestones / totalMilestones) * 100
                      : 0;

                  const progressPercentageApproved =
                    totalMilestones > 0
                      ? (approvedMilestones / totalMilestones) * 100
                      : 0;

                  const pendingRelease =
                    progressPercentageCompleted === 100 &&
                    progressPercentageApproved === 100 &&
                    !escrow.flags?.released;

                  return (
                    <React.Fragment key={escrow.contractId || ""}>
                      <TableRow
                        className="animate-fade-in"
                        onClick={() =>
                          toggleRowExpansion(escrow.contractId || "")
                        }
                      >
                        <TableCell className="font-medium">
                          {escrow.title || t("myEscrows.table.noTitle")}
                        </TableCell>
                        <TableCell>
                          {escrow.description ||
                            t("myEscrows.table.noDescription")}
                        </TableCell>
                        <TableCell>{escrow.balance || 0}</TableCell>
                        <TableCell>
                          {escrow.engagementId ||
                            t("myEscrows.table.noEngagement")}
                        </TableCell>
                        <TableCell>
                          {formatAddress(escrow.roles?.serviceProvider)}
                        </TableCell>
                        <TableCell>
                          {formatAddress(escrow.roles?.approver)}
                        </TableCell>
                        <TableCell>
                          {escrow.type === "single-release"
                            ? "Single"
                            : "Multi"}
                        </TableCell>
                        <TableCell>
                          {formatDateFromFirebase(
                            escrow.createdAt._seconds,
                            escrow.createdAt._nanoseconds,
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">
                                  {t("myEscrows.table.dropdown.openMenu")}
                                </span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                {t("myEscrows.table.dropdown.label")}
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDialogOpen(true);
                                  setSelectedEscrow(escrow);
                                }}
                              >
                                {t("myEscrows.table.dropdown.moreDetails")}
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
                                {t("myEscrows.table.dropdown.viewViewer")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <p
                            className="w-5 h-5 cursor-pointer border border-gray-400 dark:border-gray-500 rounded-lg flex justify-center items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(escrow.contractId || "");
                            }}
                          >
                            {expandedRows.includes(escrow.contractId || "")
                              ? "-"
                              : "+"}
                          </p>
                        </TableCell>
                        {escrow.flags?.disputed && (
                          <TooltipInfo
                            content={t("myEscrows.table.tooltips.disputed")}
                          >
                            <TableCell>
                              <CircleAlert
                                className="text-destructive"
                                size={22}
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {pendingRelease && (
                          <TooltipInfo
                            content={t("myEscrows.table.tooltips.pending")}
                          >
                            <TableCell>
                              <TriangleAlert
                                size={22}
                                className="text-yellow-600"
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {escrow.flags?.released && (
                          <TooltipInfo
                            content={t("myEscrows.table.tooltips.released")}
                          >
                            <TableCell>
                              <CircleCheckBig
                                className="text-green-800"
                                size={22}
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {escrow.flags?.resolved && (
                          <TooltipInfo
                            content={t("myEscrows.table.tooltips.resolved")}
                          >
                            <TableCell>
                              <Handshake className="text-green-800" size={22} />
                            </TableCell>
                          </TooltipInfo>
                        )}
                      </TableRow>
                      {escrow.milestones &&
                        expandedRows.includes(escrow.contractId || "") && (
                          <TableRow>
                            <ExpandableContent escrow={escrow} />
                          </TableRow>
                        )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center gap-4 mt-10 mb-3 px-3">
            <div className="flex items-center gap-2">
              <span>{t("myEscrows.table.pagination.itemsPerPage")}</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t("myEscrows.table.pagination.previous")}
            </Button>
            <span>
              {t("myEscrows.table.pagination.pageOf", {
                currentPage,
                totalPages,
              })}{" "}
              ({totalItems} total)
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t("myEscrows.table.pagination.next")}
            </Button>
          </div>
        </>
      ) : (
        <NoData />
      )}
      {/* Dialog */}
      <EscrowDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEscrow={setSelectedEscrow}
      />
      {/* Success Dialog */}
      <SuccessDialog
        isSuccessDialogOpen={isSuccessDialogOpen}
        setIsSuccessDialogOpen={setIsSuccessDialogOpen}
        title={t("myEscrows.success.initialized.title", {
          saved: loggedUser?.saveEscrow,
        })}
        description={t("myEscrows.success.initialized.description")}
        recentEscrow={recentEscrow}
      />
      {/* Success Release Dialog */}
      <SuccessReleaseDialog
        isSuccessReleaseDialogOpen={isSuccessReleaseDialogOpen}
        setIsSuccessReleaseDialogOpen={setIsSuccessReleaseDialogOpen}
        title={t("myEscrows.success.released.title")}
        description={t("myEscrows.success.released.description")}
        recentEscrow={recentEscrow}
      />

      {/* Success Resolve Dispute Dialog */}
      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={isSuccessResolveDisputeDialogOpen}
        setIsSuccessResolveDisputeDialogOpen={
          setIsSuccessResolveDisputeDialogOpen
        }
        title={t("myEscrows.success.resolved.title")}
        description={t("myEscrows.success.resolved.description")}
        recentEscrow={recentEscrow}
      />
    </div>
  );
};

export default MyEscrowsTable;
