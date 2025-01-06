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
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { Escrow } from "@/@types/escrow.entity";
import NoData from "@/components/utils/NoData";
import { useEscrowBoundedStore } from "../../store/ui";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import { useGlobalBoundedStore } from "@/core/store";
import LoaderData from "@/components/utils/LoaderData";
import Divider from "@/components/utils/Divider";
import { Progress } from "@/components/ui/progress";

interface MyEscrowsTableProps {
  type: "user" | "disputeResolver" | "serviceProvider";
}

const MyEscrowsTable = ({ type }: MyEscrowsTableProps) => {
  const isDialogOpen = useEscrowBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const loadingEscrows = useGlobalBoundedStore((state) => state.loadingEscrows);

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

  const { /*formatDateFromFirebase,*/ formatAddress } = useFormatUtils();

  return (
    <div className="container mx-auto py-3">
      {loadingEscrows ? (
        <LoaderData />
      ) : currentData.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((escrow: Escrow) => (
                  <React.Fragment key={escrow.id}>
                    <TableRow
                      className="animate-fade-in"
                      onClick={() => toggleRowExpansion(escrow.id)}
                    >
                      <TableCell className="font-medium">
                        {escrow.title}
                      </TableCell>
                      <TableCell>{escrow.description}</TableCell>
                      <TableCell>{escrow.amount}</TableCell>
                      <TableCell>{escrow.engagementId}</TableCell>
                      <TableCell>
                        {formatAddress(escrow.platformAddress)}
                      </TableCell>
                      <TableCell>{escrow.platformFee}</TableCell>
                      <TableCell>{formatAddress(escrow.client)}</TableCell>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDialogOpen(true);
                                setSelectedEscrow(escrow);
                              }}
                            >
                              More Details
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
                    </TableRow>
                    {escrow.milestones && expandedRows.includes(escrow.id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-4">
                          <h3 className="mb-1 font-bold text-xs">Milestones</h3>
                          <Divider type="horizontal" />
                          <div className="flex flex-col">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {escrow.milestones.map((milestone, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {milestone.description}
                                    </TableCell>
                                    <TableCell>amount</TableCell>
                                    <TableCell>status</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>

                            {/* {(() => {
                              const completedMilestones =
                                escrow.milestones.filter(
                                  (milestone) =>
                                    milestone.status === "Completed",
                                );
                              const progressValue =
                                (completedMilestones.length /
                                  escrow.milestones.length) *
                                100;
                              return <Progress value={progressValue} />;
                            })()} */}

                            {/* CAMBIAR */}
                            <div className="flex flex-col gap-2 mt-4">
                              <h3 className="mb-1 font-bold text-xs">
                                Completed
                              </h3>
                              <div className="flex items-center gap-2">
                                <Progress value={67} />
                                <strong className="text-xs">65%</strong>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <div className="mt-8 ml-10 p-3 border rounded border-primary w-full h-full">
                          <p>other data</p>
                        </div>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
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
    </div>
  );
};

export default MyEscrowsTable;
