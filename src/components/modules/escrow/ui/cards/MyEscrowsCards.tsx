import { useFormatUtils } from "@/utils/hook/format.hook";
import useMyEscrows from "../../hooks/my-escrows.hook";
import { useTranslation } from "react-i18next";
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
import { Escrow } from "@/@types/escrow.entity";
import { Milestone } from "@trustless-work/escrow";

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
  const { t } = useTranslation();
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
      (milestone: Milestone) => milestone.flags?.approved === true,
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
      !escrow.flags?.released;

    if (escrow.flags?.disputed) {
      return (
        <Badge variant="destructive" className="gap-1">
          <CircleAlert className="h-3.5 w-3.5" />
          <span>{t("myEscrows.cards.badges.dispute")}</span>
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
          <span>{t("myEscrows.cards.badges.pending")}</span>
        </Badge>
      );
    }

    if (escrow.flags?.released) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-500 text-green-600"
        >
          <CircleCheckBig className="h-3.5 w-3.5" />
          <span>{t("myEscrows.cards.badges.released")}</span>
        </Badge>
      );
    }

    if (escrow.flags?.resolved) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-500 text-green-600"
        >
          <Handshake className="h-3.5 w-3.5" />
          <span>{t("myEscrows.cards.badges.resolved")}</span>
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1">
        <Layers className="h-3.5 w-3.5" />
        <span>{t("myEscrows.cards.badges.working")}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentData.map((escrow, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-all border border-border/40 min-h-[280px] flex flex-col justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                    setSelectedEscrow(escrow);
                  }}
                >
                  <div>
                    <CardHeader className="p-4 pb-0 flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div className="space-y-1.5 w-full sm:w-2/3">
                        <CardTitle className="text-base font-medium line-clamp-2">
                          {escrow.title || t("myEscrows.cards.fallback.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {escrow.description ||
                            t("myEscrows.cards.fallback.description")}
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                        {getStatusBadge(escrow)}

                        <TooltipInfo
                          content={t("myEscrows.cards.tooltip.viewer")}
                        >
                          <Link
                            href={`https://viewer.trustlesswork.com/${escrow.contractId}`}
                            target="_blank"
                            className="sm:ml-2"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipInfo>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <div className="mt-2">
                        <h3 className="text-xl sm:text-2xl font-semibold">
                          {formatDollar(escrow?.balance) || "N/A"}
                          <span className="text-sm text-muted-foreground font-normal ml-1">
                            {t("myEscrows.cards.balance.of")}{" "}
                            {formatDollar(escrow.amount) || "N/A"}
                          </span>
                        </h3>
                      </div>

                      <ProgressEscrow escrow={escrow} />
                    </CardContent>
                  </div>

                  <CardFooter className="p-4 pt-0 justify-end items-end mt-auto">
                    <p className="text-xs text-muted-foreground italic">
                      {t("myEscrows.cards.created")}:{" "}
                      {formatDateFromFirebase(
                        escrow.createdAt.seconds,
                        escrow.createdAt.nanoseconds,
                      )}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t("myEscrows.cards.pagination.itemsPerPage")}
                </span>
                <Input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-20 h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {t("myEscrows.cards.pagination.previous")}
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t("myEscrows.cards.pagination.pageOf", {
                    currentPage,
                    totalPages,
                  })}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {t("myEscrows.cards.pagination.next")}
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
        title={
          loggedUser?.saveEscrow
            ? t("myEscrows.cards.success.initialized.title.saved")
            : t("myEscrows.cards.success.initialized.title.unsaved")
        }
        description={t("myEscrows.cards.success.initialized.description")}
        recentEscrow={recentEscrow}
      />

      {/* Success Release Dialog */}
      <SuccessReleaseDialog
        isSuccessReleaseDialogOpen={isSuccessReleaseDialogOpen}
        setIsSuccessReleaseDialogOpen={setIsSuccessReleaseDialogOpen}
        title={t("myEscrows.cards.success.released.title")}
        description={t("myEscrows.cards.success.released.description")}
        recentEscrow={recentEscrow}
      />

      {/* Success Resolve Dispute Dialog */}
      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={isSuccessResolveDisputeDialogOpen}
        setIsSuccessResolveDisputeDialogOpen={
          setIsSuccessResolveDisputeDialogOpen
        }
        title={t("myEscrows.cards.success.resolved.title")}
        description={t("myEscrows.cards.success.resolved.description")}
        recentEscrow={recentEscrow}
      />
    </>
  );
};

export default MyEscrowsCards;
