"use client";

import { Button } from "@/components/ui/button";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Pencil } from "lucide-react";
import { useEscrowBoundedStore } from "../../../store/data";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { MilestoneDetailDialog } from "../MilestoneDetailDialog";
import { MilestoneCard } from "../../cards/MilestoneCard";

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
  const setMilestoneIndex = useEscrowBoundedStore(
    (state) => state.setMilestoneIndex,
  );
  const dialogStates = useEscrowDialogs();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

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

  const handleViewDetails = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => {
    setSelectedMilestoneForDetail({
      milestone,
      index,
    });
  };

  const handleCompleteMilestone = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => {
    setCompletingMilestone(milestone);
    setMilestoneIndex(index);
    dialogStates.completeMilestone.setIsOpen(true);
  };

  console.log(selectedEscrow.milestones);

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
                    disabled={selectedEscrow.balance !== 0}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => (
            <MilestoneCard
              key={`milestone-${milestoneIndex}-${milestone.description}-${milestone.status}`}
              milestone={milestone}
              milestoneIndex={milestoneIndex}
              selectedEscrow={selectedEscrow}
              userRolesInEscrow={userRolesInEscrow}
              activeTab={activeTab}
              loadingMilestoneStates={loadingMilestoneStates}
              setLoadingMilestoneStates={setLoadingMilestoneStates}
              onViewDetails={handleViewDetails}
              onCompleteMilestone={handleCompleteMilestone}
            />
          ))}
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
