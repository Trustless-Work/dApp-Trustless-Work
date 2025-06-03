"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
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
import { Escrow } from "@trustless-work/escrow";

const MAX_VISIBLE_MILESTONES = 1;
const ITEM_HEIGHT = 50;
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

  const calculatedHeight =
    visibleMoreMilestones ||
    selectedEscrow.milestones.length <= MAX_VISIBLE_MILESTONES
      ? selectedEscrow.milestones.length * ITEM_HEIGHT
      : MAX_VISIBLE_MILESTONES * ITEM_HEIGHT;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        setVisibleMoreMilestones(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEscrow.milestones.length]);

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col gap-4 py-4 w-full md:w-4/5">
        <div className="flex w-full justify-between">
          <label htmlFor="milestones" className="flex items-center">
            {t("escrowDetailDialog.milestonesLabel")}
            <TooltipInfo content={t("escrowDetailDialog.milestonesTooltip")} />
          </label>

          <div className="flex gap-3 flex-col sm:flex-row">
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
                    className="mt-6 md:mt-0 text-xs"
                    variant="ghost"
                  >
                    <Pencil />
                    {t("escrowDetailDialog.editButton")}
                  </Button>
                </TooltipInfo>
              )}

            {selectedEscrow.milestones.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => setVisibleMoreMilestones((prev) => !prev)}
              >
                {visibleMoreMilestones ? (
                  <>
                    <ChevronUp className="mr-1" />{" "}
                    {t("escrowDetailDialog.collapse")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1" />{" "}
                    {t("escrowDetailDialog.expand")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div
          className="flex flex-col gap-4 overflow-y-auto px-10 transition-all duration-300"
          style={{ maxHeight: `${calculatedHeight}px` }}
        >
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => (
            <div
              key={`${milestone.description}-${milestone.status}`}
              className="flex flex-col sm:flex-row items-center space-x-4"
            >
              {milestone.flags?.approved ? (
                <Badge className="uppercase max-w-24 mb-4 md:mb-0">
                  {t("reusable.approved")}
                </Badge>
              ) : (
                <Badge
                  className="uppercase max-w-24 mb-4 md:mb-0"
                  variant="outline"
                >
                  {t(
                    `reusable.${milestone.status?.toLowerCase() ?? "pending"}`,
                  )}
                </Badge>
              )}

              <Input
                disabled
                value={
                  !evidenceVisibleMap[milestoneIndex]
                    ? milestone.description
                    : milestone.evidence
                }
              />

              {userRolesInEscrow.includes("serviceProvider") &&
                activeTab === "serviceProvider" &&
                milestone.status !== "completed" &&
                !milestone.flags?.approved && (
                  <Button
                    className="max-w-32"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompletingMilestone(milestone);
                      setMilestoneIndex(milestoneIndex);
                      dialogStates.completeMilestone.setIsOpen(true);
                    }}
                  >
                    <PackageCheck />
                    {t("escrowDetailDialog.completeMilestone")}
                  </Button>
                )}

              {milestone.evidence &&
                (() => {
                  const result = isValidUrl(milestone.evidence);

                  return (
                    <>
                      <TooltipInfo
                        content={
                          !evidenceVisibleMap[milestoneIndex]
                            ? t("escrowDetailDialog.showEvidence")
                            : t("escrowDetailDialog.showDescription")
                        }
                      >
                        <Button
                          className="max-w-20 mt-4 md:mt-0"
                          variant="ghost"
                          onClick={() => {
                            setEvidenceVisibleMap((prev) => ({
                              ...prev,
                              [milestoneIndex]: !prev[milestoneIndex],
                            }));
                          }}
                        >
                          {!evidenceVisibleMap[milestoneIndex] ? (
                            <FileCheck2 />
                          ) : (
                            <LetterText />
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
                              <Button className="max-w-20" variant="ghost">
                                <Link2
                                  className={
                                    result === true ? "" : "text-destructive"
                                  }
                                />
                              </Button>
                            </TooltipInfo>
                          </Link>
                        )}
                    </>
                  );
                })()}

              {userRolesInEscrow.includes("approver") &&
                activeTab === "approver" &&
                milestone.status === "completed" &&
                !milestone.flags?.approved && (
                  <Button
                    className="max-w-32"
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("escrowDetailDialog.approving")}
                      </>
                    ) : (
                      <>
                        <CheckCheck />
                        {t("escrowDetailDialog.approveMilestone")}
                      </>
                    )}
                  </Button>
                )}

              <div className="block sm:hidden border-b-2">
                ____________________________________
              </div>
            </div>
          ))}
        </div>

        <ProgressEscrow escrow={selectedEscrow} showTimeline={true} />
      </div>
    </div>
  );
};
