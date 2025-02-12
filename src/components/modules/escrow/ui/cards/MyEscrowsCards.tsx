import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoData from "@/components/utils/ui/NoData";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import { useEscrowBoundedStore } from "../../store/ui";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import ProgressEscrow from "../dialogs/utils/ProgressEscrow";
import SuccessDialog, { SuccessReleaseDialog } from "../dialogs/SuccessDialog";
import {
  CircleAlert,
  CircleCheckBig,
  Layers,
  TriangleAlert,
} from "lucide-react";
import SkeletonCards from "../utils/SkeletonCards";

// todo: unify this based on the roles
interface MyEscrowsCardsProps {
  type:
    | "issuer"
    | "approver"
    | "disputeResolver"
    | "serviceProvider"
    | "releaseSigner"
    | "platformAddress";
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
  const isSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.isSuccessDialogOpen,
  );
  const setIsSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const isSuccessReleaseDialogOpen = useEscrowBoundedStore(
    (state) => state.isSuccessReleaseDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const recentEscrow = useGlobalBoundedStore((state) => state.recentEscrow);

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
        <SkeletonCards />
      ) : currentData.length !== 0 ? (
        <div className="py-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentData.map((escrow, index) => {
                // todo: use these constants in zusntand
                const completedMilestones = escrow.milestones.filter(
                  (milestone) => milestone.status === "completed",
                ).length;

                const approvedMilestones = escrow.milestones.filter(
                  (milestone) => milestone.flag === true,
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

                // Check if both are 100% and releaseFlag is false
                const pendingRelease =
                  progressPercentageCompleted === 100 &&
                  progressPercentageApproved === 100 &&
                  !escrow.releaseFlag;

                return (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDialogOpen(true);
                      setSelectedEscrow(escrow);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {escrow.title || "No title"}
                        </p>

                        <div className="flex items-center gap-1 md:gap-3">
                          {!escrow.disputeFlag &&
                            !escrow.releaseFlag &&
                            !pendingRelease && (
                              <>
                                <p className="font-bold text-sm">Working</p>
                                <Layers size={30} />
                              </>
                            )}
                          {escrow.disputeFlag && (
                            <>
                              <p className="font-bold text-sm text-destructive">
                                In Dispute
                              </p>
                              <CircleAlert
                                size={30}
                                className="text-destructive"
                              />
                            </>
                          )}
                          {pendingRelease && (
                            <>
                              <p className="font-bold text-sm text-yellow-600">
                                Pending Release
                              </p>
                              <TriangleAlert
                                size={30}
                                className="text-yellow-600"
                              />
                            </>
                          )}
                          {escrow.releaseFlag && (
                            <>
                              <p className="font-bold text-sm text-green-800">
                                Released
                              </p>
                              <CircleCheckBig
                                className="text-green-800"
                                size={30}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline">
                        <h3 className="text-2xl font-semibold">
                          {formatDollar(escrow?.balance) || "N/A"} of{" "}
                          {formatDollar(escrow.amount) || "N/A"}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {formatAddress(escrow.approver)}
                      </p>

                      <ProgressEscrow escrow={escrow} />

                      <p className="mt-3 text-xs text-muted-foreground text-end italic">
                        <strong>Created:</strong>{" "}
                        {formatDateFromFirebase(
                          escrow.createdAt.seconds,
                          escrow.createdAt.nanoseconds,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
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
    </>
  );
};

export default MyEscrowsCards;
