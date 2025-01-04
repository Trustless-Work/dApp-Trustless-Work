import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../../hooks/my-escrows";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaStackOverflow } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MyEscrowsCards = () => {
  const {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    setItemsPerPage,
    setCurrentPage,
  } = useMyEscrows();

  const { formatDateFromFirebase, formatAddress, formatDollar } =
    useFormatUtils();

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentData.map((escrow, index) => (
          <Card key={index} className={cn("overflow-hidden")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {escrow.title || "No title"}
                </p>
                <FaStackOverflow size={30} />
              </div>
              <div className="mt-2 flex items-baseline">
                <h3 className="text-2xl font-semibold">
                  {formatDollar(escrow.amount) || "N/A"}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatAddress(escrow.client)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-end italic">
                <strong>Created:</strong>{" "}
                {formatDateFromFirebase(
                  escrow.createdAt.seconds,
                  escrow.createdAt.nanoseconds,
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controles de Paginación */}
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

export default MyEscrowsCards;
