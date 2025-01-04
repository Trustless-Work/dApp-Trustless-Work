import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { Escrow } from "@/@types/escrow.entity";
import NoData from "@/components/utils/NoData";

const MyEscrowsClientTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para manejar el Dialog

  const {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    expandedRows,
    toggleRowExpansion,
  } = useMyEscrows({ type: "user" });

  const { formatDateFromFirebase, formatAddress } = useFormatUtils();

  return (
    <div className="container mx-auto py-3">
      {currentData.length !== 0 ? (
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
                {currentData.map((row: Escrow) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className="animate-fade-in"
                      onClick={() => toggleRowExpansion(row.id)}
                    >
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.engagementId}</TableCell>
                      <TableCell>
                        {formatAddress(row.platformAddress)}
                      </TableCell>
                      <TableCell>{row.platformFee}</TableCell>
                      <TableCell>{formatAddress(row.client)}</TableCell>
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
                            toggleRowExpansion(row.id);
                          }}
                        >
                          {expandedRows.includes(row.id) ? "-" : "+"}
                        </p>
                      </TableCell>
                    </TableRow>
                    {row.milestones && expandedRows.includes(row.id) && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-4">
                          <div>
                            <p>
                              <strong>Milestones:</strong>
                            </p>
                            <ul>
                              {row.milestones.map((milestone, index) => (
                                <li key={index}>{milestone.description}</li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsDialogOpen(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyEscrowsClientTable;
