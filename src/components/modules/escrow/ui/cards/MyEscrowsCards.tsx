import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../../hooks/my-escrows.hook";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoData from "@/components/utils/ui/NoData";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import { useEscrowUIBoundedStore } from "../../store/ui";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import ProgressEscrow from "../dialogs/utils/ProgressEscrow";
import SuccessDialog, {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "../dialogs/SuccessDialog";
import {
  CircleAlert,
  CircleCheckBig,
  ExternalLink,
  Handshake,
  Layers,
  TriangleAlert,
} from "lucide-react";
import SkeletonCards from "../utils/SkeletonCards";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Escrow, Milestone } from "@/@types/escrows/escrow.entity";

// todo: unify this based on the roles
interface MyEscrowsCardsProps {
  type:
    | "issuer"
    | "approver"
    | "disputeResolver"
    | "serviceProvider"
    | "releaseSigner"
    | "platformAddress"
    | "receiver";
}

const MyEscrowsCards = ({ type }: MyEscrowsCardsProps) => {
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
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
  } = useMyEscrows({ type });

  const { formatDateFromFirebase, formatDollar } = useFormatUtils();

  const getStatusBadge = (escrow: Escrow) => {
    const completedMilestones = escrow.milestones.filter(
      (milestone: Milestone) => milestone.status === "completed",
    ).length;

    const approvedMilestones = escrow.milestones.filter(
      (milestone: Milestone) => milestone.approvedFlag === true,
    ).length;

    const totalMilestones = escrow.milestones.length;

    const progressPercentageCompleted =
      totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    const progressPercentageApproved =
      totalMilestones > 0 ? (approvedMilestones / totalMilestones) * 100 : 0;

    // Check if both are 100% and releaseFlag is false
    const pendingRelease =
      progressPercentageCompleted === 100 &&
      progressPercentageApproved === 100 &&
      !escrow.flags?.releaseFlag;

    if (escrow.flags?.disputeFlag) {
      return (
        <Badge variant="destructive" className="gap-1">
          <CircleAlert className="h-3.5 w-3.5" />
          <span>In Dispute</span>
        </Badge>
      );
    }

    if (pendingRelease) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-yellow-500 text-yellow-600"
        >
          <TriangleAlert className="h-3.5 w-3.5" />
          <span>Pending Release</span>
        </Badge>
      );
    }

    if (escrow.flags?.releaseFlag) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-500 text-green-600"
        >
          <CircleCheckBig className="h-3.5 w-3.5" />
          <span>Released</span>
        </Badge>
      );
    }

    if (escrow.flags?.resolvedFlag) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-500 text-green-600"
        >
          <Handshake className="h-3.5 w-3.5" />
          <span>Resolved</span>
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1">
        <Layers className="h-3.5 w-3.5" />
        <span>Working</span>
      </Badge>
    );
  };

  return (
    <>
      {loadingEscrows ? (
        <SkeletonCards />
      ) : currentData.length !== 0 ? (
        <div className="py-3" id="step-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentData.map((escrow, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-all border border-border/40 min-h-60 flex flex-col justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                    setSelectedEscrow(escrow);
                  }}
                >
                  <div>
                    <CardHeader className="p-4 pb-0 flex-row justify-between items-start space-y-0">
                      <div className="space-y-1.5">
                        <CardTitle className="text-base font-medium">
                          {escrow.title || "No title"}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground max-w-sm truncate">
                          {escrow.description || "No description"}
                        </p>
                      </div>

                      <div>
                        {getStatusBadge(escrow)}

                        <TooltipInfo content="View from TW Escrow Viewer">
                          <Link
                            href={`https://viewer.trustlesswork.com/${escrow.contractId}`}
                            target="_blank"
                            className="ml-2"
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink />
                            </Button>
                          </Link>
                        </TooltipInfo>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <div className="mt-2">
                        <h3 className="text-2xl font-semibold">
                          {formatDollar(escrow?.balance) || "N/A"}
                          <span className="text-sm text-muted-foreground font-normal ml-1">
                            of {formatDollar(escrow.amount) || "N/A"}
                          </span>
                        </h3>
                      </div>

                      <ProgressEscrow escrow={escrow} />
                    </CardContent>
                  </div>

                  <CardFooter className="p-4 pt-0 justify-end items-end mt-auto">
                    <p className="text-xs text-muted-foreground italic">
                      Created:{" "}
                      {formatDateFromFirebase(
                        escrow.createdAt.seconds,
                        escrow.createdAt.nanoseconds,
                      )}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mt-8 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Items per page:
                </span>
                <Input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-16 h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
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
    </>
  );
};

export default MyEscrowsCards;
