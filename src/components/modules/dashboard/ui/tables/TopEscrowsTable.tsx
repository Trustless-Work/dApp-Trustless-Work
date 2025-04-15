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
import { Escrow } from "@/@types/escrow.entity";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { getStatus } from "../../utils/escrow-status.util";
import NoData from "@/components/utils/ui/NoData";

export const TopEscrowsTable = ({ escrows }: { escrows: Escrow[] }) => {
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );

  const hasData = escrows && escrows.length > 0;

  const { formatDollar, formatDateFromFirebase } = useFormatUtils();

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
        <TableBody className="px-5">
          {hasData ? (
            escrows.map((escrow) => (
              <TableRow key={escrow.id}>
                <TableCell className="font-medium">{escrow.title}</TableCell>
                <TableCell className="text-center">
                  {formatDollar(escrow.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{getStatus(escrow)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {formatDateFromFirebase(
                    escrow.createdAt.seconds,
                    escrow.createdAt.nanoseconds,
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {formatDateFromFirebase(
                    escrow.updatedAt.seconds,
                    escrow.updatedAt.nanoseconds,
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
