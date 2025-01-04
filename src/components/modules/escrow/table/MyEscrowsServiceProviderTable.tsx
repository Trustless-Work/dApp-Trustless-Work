import { Escrow } from "@/@types/escrow.entity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../hooks/my-escrows";

const MyEscrowsServiceProviderTable = () => {
  const {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    setItemsPerPage,
    setCurrentPage,
    expandedRows,
    toggleRowExpansion,
  } = useMyEscrows();

  const { formatDateFromFirebase, formatAddress } = useFormatUtils();

  return (
    <div className="container mx-auto py-3">
      <div className="rounded-md border">
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
              <TableHead>Dispute Resolver</TableHead>
              <TableHead>Release Signer</TableHead>
              <TableHead>Service Provider</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row: Escrow) => (
              <>
                <TableRow
                  key={row.id}
                  className="animate-fade-in"
                  onClick={() => toggleRowExpansion(row.id)}
                >
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.engagementId}</TableCell>
                  <TableCell>{formatAddress(row.platformAddress)}</TableCell>
                  <TableCell>{row.platformFee}</TableCell>
                  <TableCell>{formatAddress(row.client)}</TableCell>
                  <TableCell>
                    {formatDateFromFirebase(
                      row.createdAt.seconds,
                      row.createdAt.nanoseconds,
                    )}
                  </TableCell>
                  <TableCell>{formatAddress(row.disputeResolver)}</TableCell>
                  <TableCell>{formatAddress(row.releaseSigner)}</TableCell>
                  <TableCell>{formatAddress(row.serviceProvider)}</TableCell>
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
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={
              currentPage === index + 1
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:text-white"
            }
          >
            {index + 1}
          </Button>
        ))}
        <Input
          id="itemsPerPage"
          type="number"
          min="1"
          max={currentData.length}
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value) || 1);
            setCurrentPage(1);
          }}
          className="w-20"
        />
      </div>
    </div>
  );
};

export default MyEscrowsServiceProviderTable;
