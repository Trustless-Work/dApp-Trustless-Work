import { Escrow } from "@/@types/escrow.entity"; // Asegúrate de importar Escrow correctamente
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
import useMyEscrows from "./hooks/my-escrows";

const MyEscrowsTable = () => {
  const {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    setItemsPerPage,
    setCurrentPage,
  } = useMyEscrows();

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Title</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row: Escrow) => (
              <TableRow key={row.id} className="animate-fade-in">
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell>{row.amount}</TableCell>
                {/* <TableCell>
                  {row.milestones.map((milestone, index) => (
                    <div key={index}>{milestone.description}</div>
                  ))}
                </TableCell> */}
              </TableRow>
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

export default MyEscrowsTable;
