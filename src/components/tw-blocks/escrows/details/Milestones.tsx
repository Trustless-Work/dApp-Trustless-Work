"use client";

import { useCallback, useState } from "react";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { MilestoneCard } from "./MilestoneCard";
import { MilestoneDetailDialog } from "./MilestoneDetailDialog";

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
  const [selectedMilestoneForDetail, setSelectedMilestoneForDetail] = useState<{
    milestone: SingleReleaseMilestone | MultiReleaseMilestone;
    index: number;
  } | null>(null);

  const handleViewDetails = useCallback(
    (
      milestone: SingleReleaseMilestone | MultiReleaseMilestone,
      index: number
    ) => {
      setSelectedMilestoneForDetail({
        milestone,
        index,
      });
    },
    []
  );

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex w-full justify-between items-center">
          <label
            htmlFor="milestones"
            className="flex items-center gap-2 text-lg font-medium"
          >
            Milestones
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {selectedEscrow.milestones.map((milestone, milestoneIndex) => (
            <MilestoneCard
              key={`milestone-${milestoneIndex}-${milestone.description}-${milestone.status}`}
              milestone={milestone}
              milestoneIndex={milestoneIndex}
              selectedEscrow={selectedEscrow}
              userRolesInEscrow={userRolesInEscrow}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        <MilestoneDetailDialog
          isOpen={!!selectedMilestoneForDetail}
          onClose={() => setSelectedMilestoneForDetail(null)}
          selectedMilestone={selectedMilestoneForDetail}
          selectedEscrow={selectedEscrow}
          userRolesInEscrow={userRolesInEscrow}
          evidenceVisibleMap={evidenceVisibleMap}
          setEvidenceVisibleMap={setEvidenceVisibleMap}
        />
      </div>
    </div>
  );
};
