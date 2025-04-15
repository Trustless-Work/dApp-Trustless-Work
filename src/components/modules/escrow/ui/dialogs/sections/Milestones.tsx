import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  CheckCheck,
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

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col gap-4 py-4 w-full md:w-4/5">
        <div className="flex w-full justify-between">
          <label htmlFor="milestones" className="flex items-center">
            Milestones
            <TooltipInfo content="Key stages or deliverables for the escrow." />
          </label>

          {userRolesInEscrow.includes("platformAddress") &&
            !selectedEscrow?.disputeFlag &&
            !selectedEscrow?.resolvedFlag &&
            activeTab === "platformAddress" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.editMilestone.setIsOpen(true);
                }}
                className="mt-6 md:mt-0 w-full md:w-1/12 text-xs"
                variant="ghost"
              >
                <Pencil />
                Edit
              </Button>
            )}
        </div>

        <div className="flex flex-col gap-4 max-h-[150px] overflow-y-auto px-10">
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
                      <Button
                        title={
                          !evidenceVisibleMap[milestoneIndex]
                            ? "Show Evidence"
                            : "Show Description"
                        }
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
                            <Button
                              title={
                                result === true
                                  ? "Open Evidence"
                                  : "Open Evidence (Not Secure)"
                              }
                              className="max-w-20"
                              variant="ghost"
                            >
                              <Link2
                                className={
                                  result === true ? "" : "text-destructive"
                                }
                              />
                            </Button>
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

              {/* Mobile Milestone Divider */}
              <div className="block sm:hidden border-b-2">
                ____________________________________
              </div>
            </div>
          ))}
        </div>

        <ProgressEscrow escrow={selectedEscrow} />
      </div>
    </div>
  );
};
