"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  DollarSign,
  FileCheck2,
  Flame,
  Handshake,
  LetterText,
  Link2,
  Loader2,
  PackageCheck,
  Pencil,
} from "lucide-react";
import { useEscrowBoundedStore } from "../../../store/data";
import { useValidData } from "@/utils/hook/valid-data.hook";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import Link from "next/link";
import ProgressEscrow from "../utils/ProgressEscrow";
import { useEffect, useState } from "react";
import useApproveMilestoneDialog from "../../../hooks/approve-milestone-dialog.hook";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import { useDisputeMilestoneDialog } from "../../../hooks/multi-release/dispute-milestone-dialog.hook";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { useResolveDisputeDialog } from "../../../hooks/resolve-dispute-dialog.hook";
import { useReleaseFundsMilestoneDialog } from "../../../hooks/multi-release/release-funds-milestone-dialog.hook";

const MAX_VISIBLE_MILESTONES = 2;
const ITEM_HEIGHT = 60;
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

  const { isValidUrl } = useValidData();
  const { approveMilestoneSubmit } = useApproveMilestoneDialog();

  const [visibleMoreMilestones, setVisibleMoreMilestones] =
    useState<boolean>(false);
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

  const hasMoreMilestones =
    selectedEscrow.milestones.length > MAX_VISIBLE_MILESTONES;

  const { handleOpen } = useResolveDisputeDialog();
  const { startDisputeSubmit } = useDisputeMilestoneDialog();
  const { releaseFundsSubmit } = useReleaseFundsMilestoneDialog();

  const calculatedHeight = visibleMoreMilestones
    ? "none"
    : `${Math.min(MAX_VISIBLE_MILESTONES, selectedEscrow.milestones.length) * ITEM_HEIGHT}px`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        setVisibleMoreMilestones((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col gap-6 py-6 w-full md:w-11/12">
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

            {hasMoreMilestones && (
              <Button
                variant="ghost"
                onClick={() => setVisibleMoreMilestones((prev) => !prev)}
                className="text-sm"
              >
                {visibleMoreMilestones ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    {t("escrowDetailDialog.collapse")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {t("escrowDetailDialog.expand")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col gap-6 px-4 md:px-8 transition-all duration-300 ${
            !visibleMoreMilestones ? "overflow-y-auto" : ""
          }`}
          style={{
            maxHeight: calculatedHeight,
            opacity: 1,
            visibility: "visible",
          }}
        >
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => (
            <div
              key={`milestone-${milestoneIndex}-${milestone.description}-${milestone.status}`}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex flex-wrap gap-2 items-center">
                {"disputeStartedBy" in milestone &&
                  "flags" in milestone &&
                  !milestone.flags?.resolved && (
                    <Badge variant="destructive" className="uppercase">
                      {t("reusable.disputed")} by{" "}
                      {milestone.disputeStartedBy === "serviceProvider"
                        ? t("reusable.serviceProvider")
                        : t("reusable.approver")}
                    </Badge>
                  )}

                {"flags" in milestone && milestone.flags?.released && (
                  <Badge className="uppercase">{t("reusable.released")}</Badge>
                )}

                {"flags" in milestone &&
                  milestone.flags?.resolved &&
                  !milestone.flags?.disputed && (
                    <Badge className="uppercase">
                      {t("reusable.resolved")}
                    </Badge>
                  )}

                {"flags" in milestone && milestone.flags?.approved && (
                  <Badge className="uppercase">{t("reusable.approved")}</Badge>
                )}

                {"approved" in milestone && milestone.approved && (
                  <Badge className="uppercase">{t("reusable.approved")}</Badge>
                )}

                <Badge className="uppercase" variant="outline">
                  {t(
                    `reusable.${milestone.status?.toLowerCase() ?? "pending"}`,
                  )}
                </Badge>

                {"amount" in milestone && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    {milestone.amount}
                  </Button>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Input
                  disabled
                  value={
                    !evidenceVisibleMap[milestoneIndex]
                      ? milestone.description
                      : milestone.evidence
                  }
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {userRolesInEscrow.includes("serviceProvider") &&
                  activeTab === "serviceProvider" &&
                  milestone.status !== "completed" &&
                  !("flags" in milestone && milestone.flags?.approved) && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletingMilestone(milestone);
                        setMilestoneIndex(milestoneIndex);
                        dialogStates.completeMilestone.setIsOpen(true);
                      }}
                    >
                      <PackageCheck className="w-4 h-4 mr-2" />
                      {t("escrowDetailDialog.completeMilestone")}
                    </Button>
                  )}

                {milestone.evidence &&
                  (() => {
                    const result = isValidUrl(milestone.evidence);

                    return (
                      <div className="flex gap-2">
                        <TooltipInfo
                          content={
                            !evidenceVisibleMap[milestoneIndex]
                              ? t("escrowDetailDialog.showEvidence")
                              : t("escrowDetailDialog.showDescription")
                          }
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEvidenceVisibleMap((prev) => ({
                                ...prev,
                                [milestoneIndex]: !prev[milestoneIndex],
                              }));
                            }}
                          >
                            {!evidenceVisibleMap[milestoneIndex] ? (
                              <FileCheck2 className="w-4 h-4" />
                            ) : (
                              <LetterText className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipInfo>

                        {evidenceVisibleMap[milestoneIndex] &&
                          (result === true ||
                            (result &&
                              typeof result === "object" &&
                              result.warning)) && (
                            <Link
                              href={milestone.evidence}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TooltipInfo
                                content={
                                  !evidenceVisibleMap[milestoneIndex]
                                    ? t("escrowDetailDialog.showEvidence")
                                    : t("escrowDetailDialog.showDescription")
                                }
                              >
                                <Button size="sm" variant="ghost">
                                  <Link2
                                    className={`w-4 h-4 ${
                                      result === true ? "" : "text-destructive"
                                    }`}
                                  />
                                </Button>
                              </TooltipInfo>
                            </Link>
                          )}
                      </div>
                    );
                  })()}

                {userRolesInEscrow.includes("releaseSigner") &&
                  activeTab === "releaseSigner" &&
                  "flags" in milestone &&
                  !milestone.flags?.disputed &&
                  milestone.status === "completed" &&
                  milestone.flags?.approved &&
                  !milestone.flags?.released && (
                    <Button
                      size="sm"
                      className="bg-green-800 hover:bg-green-700"
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        <>
                          <CircleDollarSign className="w-4 h-4 mr-2" />
                          {t("actions.releasePayment")}
                        </>
                      )}
                    </Button>
                  )}

                {(userRolesInEscrow.includes("serviceProvider") ||
                  userRolesInEscrow.includes("approver")) &&
                  (activeTab === "serviceProvider" ||
                    activeTab === "approver") &&
                  "flags" in milestone &&
                  !milestone.flags?.disputed &&
                  !milestone.flags?.released &&
                  !milestone.flags?.resolved && (
                    <Button
                      size="sm"
                      variant="destructive"
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Disputing...
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4 mr-2" />
                          {t("actions.startDispute")}
                        </>
                      )}
                    </Button>
                  )}

                {userRolesInEscrow.includes("disputeResolver") &&
                  activeTab === "disputeResolver" &&
                  "flags" in milestone &&
                  milestone.flags?.disputed && (
                    <Button
                      size="sm"
                      className="bg-green-800 hover:bg-green-700"
                      variant="destructive"
                      disabled={
                        loadingMilestoneStates[milestoneIndex]?.isResolving
                      }
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
                        // Reset loading state when dialog is closed
                        const resetLoading = () => {
                          setLoadingMilestoneStates((prev) => ({
                            ...prev,
                            [milestoneIndex]: {
                              ...prev[milestoneIndex],
                              isResolving: false,
                            },
                          }));
                        };
                        // Add event listener to reset loading state when dialog is closed
                        const dialog =
                          document.querySelector('[role="dialog"]');
                        if (dialog) {
                          const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                              if (
                                mutation.type === "attributes" &&
                                mutation.attributeName === "aria-hidden"
                              ) {
                                if (
                                  dialog.getAttribute("aria-hidden") === "true"
                                ) {
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resolving...
                        </>
                      ) : (
                        <>
                          <Handshake className="w-4 h-4 mr-2" />
                          {t("actions.resolveDispute")}
                        </>
                      )}
                    </Button>
                  )}

                {userRolesInEscrow.includes("approver") &&
                  activeTab === "approver" &&
                  milestone.status === "completed" &&
                  (("approved" in milestone && !milestone.approved) ||
                    ("flags" in milestone && !milestone.flags?.approved)) && (
                    <Button
                      size="sm"
                      disabled={isChangingFlag}
                      onClick={() =>
                        approveMilestoneSubmit(
                          selectedEscrow,
                          milestone,
                          milestoneIndex,
                        )
                      }
                    >
                      {isChangingFlag ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("escrowDetailDialog.approving")}
                        </>
                      ) : (
                        <>
                          <CheckCheck className="w-4 h-4 mr-2" />
                          {t("escrowDetailDialog.approveMilestone")}
                        </>
                      )}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>

        <ProgressEscrow escrow={selectedEscrow} showTimeline={true} />
      </div>
    </div>
  );
};
