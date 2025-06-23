"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  CheckCheck,
  CircleDollarSign,
  DollarSign,
  FileCheck2,
  Flame,
  Handshake,
  Loader2,
  PackageCheck,
  Pencil,
  Eye,
} from "lucide-react";
import { useEscrowBoundedStore } from "../../../store/data";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { useState } from "react";
import useApproveMilestoneDialog from "../../../hooks/approve-milestone-dialog.hook";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import { useDisputeMilestoneDialog } from "../../../hooks/multi-release/dispute-milestone-dialog.hook";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { useResolveDisputeDialog } from "../../../hooks/resolve-dispute-dialog.hook";
import { useReleaseFundsMilestoneDialog } from "../../../hooks/multi-release/release-funds-milestone-dialog.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MilestoneDetailDialog } from "../MilestoneDetailDialog";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface MilestonesProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  setEvidenceVisibleMap: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  evidenceVisibleMap: Record<number, boolean>;
}

export const Milestones = ({
  selectedEscrow,
  userRolesInEscrow,
  setEvidenceVisibleMap,
  evidenceVisibleMap,
}: MilestonesProps) => {
  const { t } = useTranslation();
  const setCompletingMilestone = useEscrowBoundedStore(
    (state) => state.setCompletingMilestone,
  );
  const isChangingFlag = useEscrowUIBoundedStore(
    (state) => state.isChangingFlag,
  );
  const setMilestoneIndex = useEscrowBoundedStore(
    (state) => state.setMilestoneIndex,
  );
  const dialogStates = useEscrowDialogs();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const { approveMilestoneSubmit } = useApproveMilestoneDialog();

  const [loadingMilestoneStates, setLoadingMilestoneStates] = useState<
    Record<
      number,
      {
        isDisputing: boolean;
        isReleasing: boolean;
        isResolving: boolean;
      }
    >
  >({});

  const [selectedMilestoneForDetail, setSelectedMilestoneForDetail] = useState<{
    milestone: SingleReleaseMilestone | MultiReleaseMilestone;
    index: number;
  } | null>(null);

  const { handleOpen } = useResolveDisputeDialog();
  const { startDisputeSubmit } = useDisputeMilestoneDialog();
  const { releaseFundsSubmit } = useReleaseFundsMilestoneDialog();
  const { formatDollar } = useFormatUtils();

  const getMilestoneStatusBadge = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
  ) => {
    if (
      "disputeStartedBy" in milestone &&
      "flags" in milestone &&
      !milestone.flags?.resolved
    ) {
      return (
        <Badge variant="destructive" className="uppercase text-xs px-2 py-1">
          {t("reusable.disputed")}
        </Badge>
      );
    }
    if ("flags" in milestone && milestone.flags?.released) {
      return (
        <Badge className="uppercase text-xs bg-green-600 px-2 py-1">
          {t("reusable.released")}
        </Badge>
      );
    }
    if (
      "flags" in milestone &&
      milestone.flags?.resolved &&
      !milestone.flags?.disputed
    ) {
      return (
        <Badge className="uppercase text-xs bg-blue-600 px-2 py-1">
          {t("reusable.resolved")}
        </Badge>
      );
    }
    if (
      ("flags" in milestone && milestone.flags?.approved) ||
      ("approved" in milestone && milestone.approved)
    ) {
      return (
        <Badge className="uppercase text-xs bg-green-600 px-2 py-1">
          {t("reusable.approved")}
        </Badge>
      );
    }
    return (
      <Badge className="uppercase text-xs px-2 py-1" variant="outline">
        {t(`reusable.${milestone.status?.toLowerCase() ?? "pending"}`)}
      </Badge>
    );
  };

  const getActionButtons = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    milestoneIndex: number,
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
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-0"
          onClick={(e) => {
            e.stopPropagation();
            setCompletingMilestone(milestone);
            setMilestoneIndex(milestoneIndex);
            dialogStates.completeMilestone.setIsOpen(true);
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
          className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-0"
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
          className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-0"
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
        ("flags" in milestone && !milestone.flags?.approved))
    ) {
      buttons.push(
        <Button
          key="approve"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-0"
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

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* Header Section */}
        <div className="flex w-full justify-between items-center">
          <label
            htmlFor="milestones"
            className="flex items-center gap-2 text-lg font-medium"
          >
            {t("escrowDetailDialog.milestonesLabel")}
            <TooltipInfo content={t("escrowDetailDialog.milestonesTooltip")} />
          </label>

          <div className="flex gap-4 items-center">
            {userRolesInEscrow.includes("platformAddress") &&
              !selectedEscrow?.flags?.disputed &&
              !selectedEscrow?.flags?.resolved &&
              !selectedEscrow?.flags?.released &&
              activeTab === "platformAddress" && (
                <TooltipInfo
                  content={t("escrowDetailDialog.editMilestonesTooltip")}
                >
                  <Button
                    disabled={Number(selectedEscrow.balance) === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      dialogStates.editMilestone.setIsOpen(true);
                    }}
                    className="text-sm"
                    variant="ghost"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    {t("escrowDetailDialog.editButton")}
                  </Button>
                </TooltipInfo>
              )}
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => {
            const actionButtons = getActionButtons(milestone, milestoneIndex);
            const hasActions = actionButtons.length > 0;

            return (
              <Card
                key={`milestone-${milestoneIndex}-${milestone.description}-${milestone.status}`}
                className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Milestone {milestoneIndex + 1}
                    </CardTitle>
                    {getMilestoneStatusBadge(milestone)}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Amount */}
                  {"amount" in milestone && (
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatDollar(milestone.amount)}
                      </span>
                    </div>
                  )}

                  {/* Evidence indicator */}
                  {milestone.evidence && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <FileCheck2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs text-blue-700 font-medium">
                        Evidence provided
                      </span>
                    </div>
                  )}

                  {/* Action Buttons Section */}
                  {hasActions && (
                    <div
                      className={`grid gap-2 ${actionButtons.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                    >
                      {actionButtons}
                    </div>
                  )}

                  {/* View Details Button - Always present */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMilestoneForDetail({
                        milestone,
                        index: milestoneIndex,
                      });
                    }}
                  >
                    <Eye className="w-3 h-3 mr-2 flex-shrink-0" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Milestone Detail Modal */}
        <MilestoneDetailDialog
          isOpen={!!selectedMilestoneForDetail}
          onClose={() => setSelectedMilestoneForDetail(null)}
          selectedMilestone={selectedMilestoneForDetail}
          selectedEscrow={selectedEscrow}
          userRolesInEscrow={userRolesInEscrow}
          activeTab={activeTab}
          evidenceVisibleMap={evidenceVisibleMap}
          setEvidenceVisibleMap={setEvidenceVisibleMap}
          loadingMilestoneStates={loadingMilestoneStates}
          setLoadingMilestoneStates={setLoadingMilestoneStates}
        />
      </div>
    </div>
  );
};
