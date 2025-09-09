"use client";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { FileCheck2, Eye } from "lucide-react";
import { Escrow } from "@/types/escrow.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { useEscrowBoundedStore } from "../../store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import useApproveMilestoneDialog from "../../hooks/useApproveMilestoneDialog";
import { useDisputeMilestoneDialog } from "../../hooks/multi-release/useDisputeMilestoneDialog";
import { useResolveDisputeDialog } from "../../hooks/useResolveDisputeDialog";
import { useReleaseFundsMilestoneDialog } from "../../hooks/multi-release/useDeleaseFundsMilestoneDialog";
import {
  getActionButtons,
  getMilestoneStatusBadge,
} from "@/shared/utils/Status";
import { formatCurrency } from "@/lib/format";

interface MilestoneCardProps {
  milestone: SingleReleaseMilestone | MultiReleaseMilestone;
  milestoneIndex: number;
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  activeTab: string;
  loadingMilestoneStates: Record<
    number,
    {
      isDisputing: boolean;
      isReleasing: boolean;
      isResolving: boolean;
    }
  >;
  setLoadingMilestoneStates: React.Dispatch<
    React.SetStateAction<
      Record<
        number,
        {
          isDisputing: boolean;
          isReleasing: boolean;
          isResolving: boolean;
        }
      >
    >
  >;
  onViewDetails: (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void;
  onChangeMilestoneStatus: (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void;
}

export const MilestoneCard = ({
  milestone,
  milestoneIndex,
  selectedEscrow,
  userRolesInEscrow,
  activeTab,
  loadingMilestoneStates,
  setLoadingMilestoneStates,
  onViewDetails,
  onChangeMilestoneStatus,
}: MilestoneCardProps) => {
  const isChangingFlag = useEscrowUIBoundedStore(
    (state) => state.isChangingFlag,
  );
  const setMilestoneIndex = useEscrowBoundedStore(
    (state) => state.setMilestoneIndex,
  );

  const { approveMilestoneSubmit } = useApproveMilestoneDialog();
  const { handleOpen } = useResolveDisputeDialog();
  const { startDisputeSubmit } = useDisputeMilestoneDialog();
  const { releaseFundsSubmit } = useReleaseFundsMilestoneDialog();

  const actionButtons = getActionButtons(
    milestone,
    milestoneIndex,
    userRolesInEscrow,
    activeTab,
    onChangeMilestoneStatus,
    loadingMilestoneStates,
    setLoadingMilestoneStates,
    selectedEscrow,
    approveMilestoneSubmit,
    isChangingFlag,
    startDisputeSubmit,
    releaseFundsSubmit,
    setMilestoneIndex,
    handleOpen,
  );
  const hasActions = actionButtons.length > 0;

  return (
    <Card
      key={`milestone-${milestoneIndex}-${milestone.description}-${milestone.status}`}
      className="hover:shadow-lg transition-all duration-200"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground truncate">
            {milestone.description}
          </CardTitle>
          {getMilestoneStatusBadge(milestone)}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Amount */}
        {"amount" in milestone && (
          <div className="flex items-center gap-2 py-2">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(milestone.amount, selectedEscrow.trustline?.name)}
            </span>
          </div>
        )}

        {/* Evidence indicator */}
        {milestone.evidence && (
          <div className="flex items-center gap-2 p-2 border-primary/20 rounded-lg">
            <FileCheck2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              Evidence provided
            </span>
          </div>
        )}

        {/* Action Buttons Section */}
        {hasActions && (
          <div
            className={`grid gap-2 sm:gap-3 ${
              actionButtons.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {actionButtons}
          </div>
        )}

        {/* View Details Button - Always present */}
        <Button
          size="sm"
          variant="outline"
          className="w-full border-border text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(milestone, milestoneIndex);
          }}
        >
          <Eye className="w-3 h-3 mr-2 flex-shrink-0" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
