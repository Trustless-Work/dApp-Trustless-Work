import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaStackOverflow } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoData from "@/components/utils/NoData";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import { useEscrowBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import LoaderData from "@/components/utils/LoaderData";
import { Progress } from "@/components/ui/progress";

interface MyEscrowsCardsProps {
  type: "issuer" | "client" | "disputeResolver" | "serviceProvider";
}

const MyEscrowsCards = ({ type }: MyEscrowsCardsProps) => {
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
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
  } = useMyEscrows({ type });

  const { formatDateFromFirebase, formatAddress, formatDollar } =
    useFormatUtils();

  return (
    <>
      {loadingEscrows ? (
        <LoaderData />
      ) : currentData.length !== 0 ? (
        <div className="py-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentData.map((escrow, index) => (
                <Card
                  key={index}
                  className={cn(
                    "overflow-hidden cursor-pointer hover:shadow-lg",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                    setSelectedEscrow(escrow);
                  }}
                >
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

                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="mb-1 font-bold text-xs">Completed</h3>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const completedMilestones = escrow.milestones.filter(
                            (milestone) => milestone.status === "completed",
                          ).length;
                          const totalMilestones = escrow.milestones.length;
                          const progressPercentage =
                            totalMilestones > 0
                              ? (completedMilestones / totalMilestones) * 100
                              : 0;

                          return (
                            <>
                              <Progress value={progressPercentage} />
                              <strong className="text-xs">
                                {progressPercentage.toFixed(0)}%
                              </strong>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground text-end italic">
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
          </div>
        </div>
      ) : (
        <Card className={cn("overflow-hidden")}>
          <NoData isCard={true} />
        </Card>
      )}

      {/* Dialog */}
      <EscrowDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEscrow={setSelectedEscrow}
      />
    </>
  );
};

export default MyEscrowsCards;
