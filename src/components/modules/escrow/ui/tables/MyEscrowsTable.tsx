import React from "react";
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
import { Input } from "@/components/ui/input";
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

interface MyEscrowsTableProps {
  type:
    | "issuer"
    | "approver"
    | "disputeResolver"
    | "serviceProvider"
    | "releaseSigner"
    | "platformAddress"
    | "receiver";
}

const MyEscrowsTable = ({ type }: MyEscrowsTableProps) => {
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const loadingEscrows = useGlobalBoundedStore((state) => state.loadingEscrows);
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
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    expandedRows,
    toggleRowExpansion,
  } = useMyEscrows({ type });

  const { formatDateFromFirebase, formatAddress } = useFormatUtils();

  return (
    <div className="container mx-auto py-3" id="step-3">
      {loadingEscrows ? (
        <SkeletonTable />
      ) : currentData.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Service Provider</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((escrow: Escrow) => {
                  // todo: use these constants in zusntand
                  const completedMilestones = escrow.milestones.filter(
                    (milestone) => milestone.status === "completed",
                  ).length;

                  const approvedMilestones = escrow.milestones.filter(
                    (milestone) => milestone.flags?.approved === true,
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
                    <React.Fragment key={escrow.id}>
                      <TableRow
                        className="animate-fade-in"
                        onClick={() => toggleRowExpansion(escrow.id)}
                      >
                        <TableCell className="font-medium">
                          {escrow.title || "No title"}
                        </TableCell>
                        <TableCell>
                          {escrow.description || "No description"}
                        </TableCell>
                        <TableCell>{escrow.balance || "No balance"}</TableCell>
                        <TableCell>
                          {escrow.engagementId || "No engagement"}
                        </TableCell>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDialogOpen(true);
                                  setSelectedEscrow(escrow);
                                }}
                              >
                                More Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://viewer.trustlesswork.com/${escrow.contractId}`,
                                    "_blank",
                                  );
                                }}
                              >
                                View from TW Escrow Viewer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <p
                            className="w-5 h-5 cursor-pointer border border-gray-400 dark:border-gray-500 rounded-lg flex justify-center items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(escrow.id);
                            }}
                          >
                            {expandedRows.includes(escrow.id) ? "-" : "+"}
                          </p>
                        </TableCell>
                        {escrow.flags?.disputed && (
                          <TooltipInfo content="Escrow in Dispute">
                            <TableCell>
                              <CircleAlert
                                className="text-destructive"
                                size={22}
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {pendingRelease && (
                          <TooltipInfo content="Escrow pending release">
                            <TableCell>
                              <TriangleAlert
                                size={22}
                                className="text-yellow-600"
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {escrow.flags?.released && (
                          <TooltipInfo content="Escrow released">
                            <TableCell>
                              <CircleCheckBig
                                className="text-green-800"
                                size={22}
                              />
                            </TableCell>
                          </TooltipInfo>
                        )}

                        {escrow.flags?.resolved && (
                          <TooltipInfo content="Escrow resolved">
                            <TableCell>
                              <Handshake className="text-green-800" size={22} />
                            </TableCell>
                          </TooltipInfo>
                        )}
                      </TableRow>
                      {escrow.milestones &&
                        expandedRows.includes(escrow.id) && (
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
              <span>Items per page:</span>
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
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
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
        title={`${loggedUser?.saveEscrow ? "Escrow initialized successfully" : "Escrow initialized successfully, but according to your settings, it was not saved"}`}
        description="Now that your escrow is initialized, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />
      {/* Success Release Dialog */}
      <SuccessReleaseDialog
        isSuccessReleaseDialogOpen={isSuccessReleaseDialogOpen}
        setIsSuccessReleaseDialogOpen={setIsSuccessReleaseDialogOpen}
        title={"Escrow released"}
        description="Now that your escrow is released, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />

      {/* Success Resolve Dispute Dialog */}
      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={isSuccessResolveDisputeDialogOpen}
        setIsSuccessResolveDisputeDialogOpen={
          setIsSuccessResolveDisputeDialogOpen
        }
        title={"Escrow's dispute resolved"}
        description="Now that your escrow's dispute is resolved, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />
    </div>
  );
};

export default MyEscrowsTable;
