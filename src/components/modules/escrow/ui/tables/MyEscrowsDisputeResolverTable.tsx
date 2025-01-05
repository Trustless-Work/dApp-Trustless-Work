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
import useMyEscrows from "../../hooks/my-escrows.hook";
import NoData from "@/components/utils/NoData";

const MyEscrowsDisputeResolverTable = () => {
  const {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    expandedRows,
    toggleRowExpansion,
  } = useMyEscrows({ type: "disputeResolver" });

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
                      <TableCell>
                        {formatAddress(row.platformAddress)}
                      </TableCell>
                      <TableCell>{row.platformFee}</TableCell>
                      <TableCell>{formatAddress(row.client)}</TableCell>
                      <TableCell>
                        {formatDateFromFirebase(
                          row.createdAt.seconds,
                          row.createdAt.nanoseconds,
                        )}
                      </TableCell>
                      <TableCell>
                        {formatAddress(row.disputeResolver)}
                      </TableCell>
                      <TableCell>{formatAddress(row.releaseSigner)}</TableCell>
                      <TableCell>
                        {formatAddress(row.serviceProvider)}
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
                  </>
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
    </div>
  );
};

export default MyEscrowsDisputeResolverTable;
