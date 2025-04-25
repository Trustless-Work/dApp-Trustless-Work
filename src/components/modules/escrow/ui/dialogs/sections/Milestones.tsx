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
  PackageCheck,
  Pencil,
} from "lucide-react";
import { useEscrowBoundedStore } from "../../../store/data";
import useChangeFlagEscrowDialog from "../hooks/change-flag-escrow-dialog.hook";
import { useValidData } from "@/utils/hook/valid-data.hook";
import { Escrow } from "@/@types/escrow.entity";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import Link from "next/link";
import ProgressEscrow from "../utils/ProgressEscrow";
import { useEffect, useState } from "react";

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
  const setCompletingMilestone = useEscrowBoundedStore(
    (state) => state.setCompletingMilestone,
  );
  const setMilestoneIndex = useEscrowBoundedStore(
    (state) => state.setMilestoneIndex,
  );
  const dialogStates = useEscrowDialogs();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const { isValidUrl } = useValidData();
  const { changeMilestoneFlagSubmit } = useChangeFlagEscrowDialog();

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
            Milestones
            <TooltipInfo content="Key stages or deliverables for the escrow." />
          </label>

          <div className="flex gap-3 flex-col sm:flex-row">
            {userRolesInEscrow.includes("platformAddress") &&
              !selectedEscrow?.disputeFlag &&
              !selectedEscrow?.resolvedFlag &&
              !selectedEscrow?.releaseFlag &&
              activeTab === "platformAddress" && (
                <TooltipInfo content="Edit Milestones">
                  <Button
                    disabled={selectedEscrow?.balance !== undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      dialogStates.editMilestone.setIsOpen(true);
                    }}
                    className="mt-6 md:mt-0 text-xs"
                    variant="ghost"
                  >
                    <Pencil />
                    Edit
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
                    <ChevronUp className="mr-1" /> Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1" /> Expand
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
              {milestone.approved_flag ? (
                <Badge className="uppercase max-w-24 mb-4 md:mb-0">
                  Approved
                </Badge>
              ) : (
                <Badge
                  className="uppercase max-w-24 mb-4 md:mb-0"
                  variant="outline"
                >
                  {milestone.status}
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
                !milestone.approved_flag && (
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
                    Complete
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
                            ? "Show Evidence"
                            : "Show Description"
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
                                  ? "Show Evidence"
                                  : "Show Description"
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
                !milestone.approved_flag && (
                  <Button
                    className="max-w-32"
                    onClick={() =>
                      changeMilestoneFlagSubmit(
                        selectedEscrow,
                        milestone,
                        milestoneIndex,
                      )
                    }
                  >
                    <CheckCheck />
                    Approve
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
