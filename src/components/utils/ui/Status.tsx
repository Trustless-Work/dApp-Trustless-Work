import { Badge } from "@/components/ui/badge";
import {
  CircleAlert,
  CircleCheckBig,
  Handshake,
  Layers,
  PackageCheck,
  TriangleAlert,
  Loader2,
  CircleDollarSign,
  Flame,
  CheckCheck,
  CheckCircle,
  XCircle,
  SquareCheckBig,
} from "lucide-react";
import { Escrow } from "@/@types/escrow.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { Button } from "@/components/ui/button";
import { t } from "i18next";

export const getStatusBadge = (escrow: Escrow) => {
  const completedMilestones = escrow.milestones.filter(
    (milestone: MultiReleaseMilestone | SingleReleaseMilestone) =>
      milestone.status === "completed",
  ).length;

  const approvedMilestones = escrow.milestones.filter(
    (milestone: SingleReleaseMilestone | MultiReleaseMilestone) =>
      ("flags" in milestone && milestone.flags?.approved === true) ||
      ("approved" in milestone && milestone.approved === true),
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
      <Badge variant="destructive">
        <CircleAlert className="h-3.5 w-3.5" />
        <span>{t("reusable.disputed")}</span>
      </Badge>
    );
  }

  if (pendingRelease) {
    return (
      <Badge variant="warning">
        <TriangleAlert className="h-3.5 w-3.5" />
        <span>Pending Release</span>
      </Badge>
    );
  }

  if (escrow.flags?.released) {
    return (
      <Badge variant="success">
        <CircleCheckBig className="h-3.5 w-3.5" />
        <span>{t("reusable.released")}</span>
      </Badge>
    );
  }

  if (escrow.flags?.resolved) {
    return (
      <Badge variant="success">
        <Handshake className="h-3.5 w-3.5" />
        <span>{t("reusable.resolved")}</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <Layers className="h-3.5 w-3.5" />
      <span>Working</span>
    </Badge>
  );
};

export const getMultiReleaseStatusBadge = (escrow: Escrow) => {
  const allMilestonesReleased = escrow.milestones.every(
    (milestone: MultiReleaseMilestone | SingleReleaseMilestone) => {
      if ("flags" in milestone) {
        return (
          milestone.flags?.released === true ||
          milestone.flags?.resolved === true
        );
      }
      return false;
    },
  );

  if (allMilestonesReleased) {
    return (
      <Badge variant="success">
        <SquareCheckBig className="h-3.5 w-3.5" />
        <span>Finished</span>
      </Badge>
    );
  }
};

export const getMilestoneStatusBadge = (
  milestone: SingleReleaseMilestone | MultiReleaseMilestone,
) => {
  if ("flags" in milestone && milestone.flags?.disputed) {
    return (
      <Badge variant="destructive">
        <CircleAlert className="h-3.5 w-3.5" />
        <span>{t("reusable.disputed")}</span>
      </Badge>
    );
  }
  if ("flags" in milestone && milestone.flags?.released) {
    return (
      <Badge variant="success">
        <CircleCheckBig className="h-3.5 w-3.5" />
        <span>{t("reusable.released")}</span>
      </Badge>
    );
  }
  if (
    "flags" in milestone &&
    milestone.flags?.resolved &&
    !milestone.flags?.disputed
  ) {
    return (
      <Badge variant="success">
        <Handshake className="h-3.5 w-3.5" />
        <span>{t("reusable.resolved")}</span>
      </Badge>
    );
  }
  if (
    ("flags" in milestone && milestone.flags?.approved) ||
    ("approved" in milestone && milestone.approved)
  ) {
    return (
      <Badge variant="success">
        <CheckCheck className="h-3.5 w-3.5" />
        <span>{t("reusable.approved")}</span>
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      <Layers className="h-3.5 w-3.5" />
      <span>
        {t(`reusable.${milestone.status?.toLowerCase() ?? "pending"}`)}
      </span>
    </Badge>
  );
};

export const getActionButtons = (
  milestone: SingleReleaseMilestone | MultiReleaseMilestone,
  milestoneIndex: number,
  userRolesInEscrow: string[],
  activeTab: string,
  onCompleteMilestone: (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void,
  loadingMilestoneStates: Record<
    number,
    { isDisputing: boolean; isReleasing: boolean; isResolving: boolean }
  >,
  setLoadingMilestoneStates: React.Dispatch<
    React.SetStateAction<
      Record<
        number,
        { isDisputing: boolean; isReleasing: boolean; isResolving: boolean }
      >
    >
  >,
  selectedEscrow: Escrow,
  approveMilestoneSubmit: (
    escrow: Escrow,
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void,
  isChangingFlag: boolean,
  startDisputeSubmit: (
    escrow: Escrow,
    milestone: MultiReleaseMilestone,
    index: number,
    onSuccess: () => void,
  ) => void,
  releaseFundsSubmit: (onSuccess: () => void) => void,
  setMilestoneIndex: (index: number) => void,
  handleOpen: (e: React.MouseEvent<HTMLButtonElement>) => void,
) => {
  const buttons = [];

  // Service Provider - Complete Milestone
  if (
    userRolesInEscrow.includes("serviceProvider") &&
    activeTab === "serviceProvider" &&
    milestone.status !== "completed" &&
    !("flags" in milestone && milestone.flags?.approved)
  ) {
    buttons.push(
      <Button
        key="complete"
        size="sm"
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          onCompleteMilestone(milestone, milestoneIndex);
        }}
      >
        <PackageCheck className="w-3 h-3 mr-1 flex-shrink-0" />
        <span className="truncate">
          {t("escrowDetailDialog.completeMilestone")}
        </span>
      </Button>,
    );
  }

  // Release Signer - Release Payment
  if (
    userRolesInEscrow.includes("releaseSigner") &&
    activeTab === "releaseSigner" &&
    "flags" in milestone &&
    !milestone.flags?.disputed &&
    milestone.status === "completed" &&
    milestone.flags?.approved &&
    !milestone.flags?.released
  ) {
    buttons.push(
      <Button
        key="release"
        size="sm"
        variant="success"
        disabled={
          loadingMilestoneStates[milestoneIndex]?.isReleasing ||
          Number(selectedEscrow.balance) === 0 ||
          !selectedEscrow.balance
        }
        onClick={(e) => {
          e.stopPropagation();
          setLoadingMilestoneStates((prev) => ({
            ...prev,
            [milestoneIndex]: {
              ...prev[milestoneIndex],
              isReleasing: true,
            },
          }));
          releaseFundsSubmit(() => {
            setLoadingMilestoneStates((prev) => ({
              ...prev,
              [milestoneIndex]: {
                ...prev[milestoneIndex],
                isReleasing: false,
              },
            }));
          });
          setMilestoneIndex(milestoneIndex);
        }}
      >
        {loadingMilestoneStates[milestoneIndex]?.isReleasing ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
            <span className="truncate">Releasing...</span>
          </>
        ) : (
          <>
            <CircleDollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{t("actions.releasePayment")}</span>
          </>
        )}
      </Button>,
    );
  }

  // Service Provider/Approver - Start Dispute
  if (
    (userRolesInEscrow.includes("serviceProvider") ||
      userRolesInEscrow.includes("approver")) &&
    (activeTab === "serviceProvider" || activeTab === "approver") &&
    "flags" in milestone &&
    !milestone.flags?.disputed &&
    !milestone.flags?.released &&
    !milestone.flags?.resolved
  ) {
    buttons.push(
      <Button
        key="dispute"
        size="sm"
        variant="destructive"
        className="flex-1 min-w-0"
        disabled={
          loadingMilestoneStates[milestoneIndex]?.isDisputing ||
          Number(selectedEscrow.balance) === 0 ||
          !selectedEscrow.balance
        }
        onClick={(e) => {
          e.stopPropagation();
          setLoadingMilestoneStates((prev) => ({
            ...prev,
            [milestoneIndex]: {
              ...prev[milestoneIndex],
              isDisputing: true,
            },
          }));
          startDisputeSubmit(
            selectedEscrow,
            milestone as MultiReleaseMilestone,
            milestoneIndex,
            () => {
              setLoadingMilestoneStates((prev) => ({
                ...prev,
                [milestoneIndex]: {
                  ...prev[milestoneIndex],
                  isDisputing: false,
                },
              }));
            },
          );
        }}
      >
        {loadingMilestoneStates[milestoneIndex]?.isDisputing ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
            <span className="truncate">Disputing...</span>
          </>
        ) : (
          <>
            <Flame className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{t("actions.startDispute")}</span>
          </>
        )}
      </Button>,
    );
  }

  // Dispute Resolver - Resolve Dispute
  if (
    userRolesInEscrow.includes("disputeResolver") &&
    activeTab === "disputeResolver" &&
    "flags" in milestone &&
    milestone.flags?.disputed
  ) {
    buttons.push(
      <Button
        key="resolve"
        size="sm"
        variant="success"
        disabled={loadingMilestoneStates[milestoneIndex]?.isResolving}
        onClick={(e) => {
          e.stopPropagation();
          setLoadingMilestoneStates((prev) => ({
            ...prev,
            [milestoneIndex]: {
              ...prev[milestoneIndex],
              isResolving: true,
            },
          }));
          handleOpen(e);
          setMilestoneIndex(milestoneIndex);
          const resetLoading = () => {
            setLoadingMilestoneStates((prev) => ({
              ...prev,
              [milestoneIndex]: {
                ...prev[milestoneIndex],
                isResolving: false,
              },
            }));
          };
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog) {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (
                  mutation.type === "attributes" &&
                  mutation.attributeName === "aria-hidden"
                ) {
                  if (dialog.getAttribute("aria-hidden") === "true") {
                    resetLoading();
                    observer.disconnect();
                  }
                }
              });
            });
            observer.observe(dialog, { attributes: true });
          }
        }}
      >
        {loadingMilestoneStates[milestoneIndex]?.isResolving ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
            <span className="truncate">Resolving...</span>
          </>
        ) : (
          <>
            <Handshake className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{t("actions.resolveDispute")}</span>
          </>
        )}
      </Button>,
    );
  }

  // Approver - Approve Milestone
  if (
    userRolesInEscrow.includes("approver") &&
    activeTab === "approver" &&
    milestone.status === "completed" &&
    (("approved" in milestone && !milestone.approved) ||
      ("flags" in milestone && !milestone.flags?.approved)) &&
    "flags" in milestone &&
    !milestone.flags?.disputed &&
    "flags" in milestone &&
    !milestone.flags?.released &&
    "flags" in milestone &&
    !milestone.flags?.resolved
  ) {
    buttons.push(
      <Button
        key="approve"
        size="sm"
        variant="success"
        disabled={isChangingFlag}
        onClick={(e) => {
          e.stopPropagation();
          approveMilestoneSubmit(selectedEscrow, milestone, milestoneIndex);
        }}
      >
        {isChangingFlag ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
            <span className="truncate">
              {t("escrowDetailDialog.approving")}
            </span>
          </>
        ) : (
          <>
            <CheckCheck className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {t("escrowDetailDialog.approveMilestone")}
            </span>
          </>
        )}
      </Button>,
    );
  }

  return buttons;
};
