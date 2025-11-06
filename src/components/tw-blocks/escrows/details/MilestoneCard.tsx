"use client";
import React from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  FileCheck2,
  Eye,
  CircleAlert,
  CircleCheckBig,
  Handshake,
  CheckCheck,
  Layers,
} from "lucide-react";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { Badge } from "@/ui/badge";
import { ChangeMilestoneStatusDialog } from "../single-multi-release/change-milestone-status/dialog/ChangeMilestoneStatus";
import { ApproveMilestoneButton } from "../single-multi-release/approve-milestone/button/ApproveMilestone";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";
import { ReleaseMilestoneButton } from "../multi-release/release-milestone/button/ReleaseMilestone";
import { DisputeMilestoneButton } from "../multi-release/dispute-milestone/button/DisputeMilestone";
import { ResolveDisputeDialog } from "../multi-release/resolve-dispute/dialog/ResolveDispute";
import { useEscrowUIBoundedStore } from "@/modules/escrow/store/ui";

interface MilestoneCardProps {
  milestone: SingleReleaseMilestone | MultiReleaseMilestone;
  milestoneIndex: number;
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  onViewDetails: (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    index: number,
  ) => void;
}

const MilestoneCardComponent = ({
  milestone,
  milestoneIndex,
  selectedEscrow,
  userRolesInEscrow,
  onViewDetails,
}: MilestoneCardProps) => {
  const getMilestoneStatusBadge = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
  ) => {
    if ("flags" in milestone && milestone.flags?.disputed) {
      return (
        <Badge variant="destructive">
          <CircleAlert className="h-3.5 w-3.5" />
          <span>Disputed</span>
        </Badge>
      );
    }
    if ("flags" in milestone && milestone.flags?.released) {
      return (
        <Badge variant="default">
          <CircleCheckBig className="h-3.5 w-3.5" />
          <span>Released</span>
        </Badge>
      );
    }
    if (
      "flags" in milestone &&
      milestone.flags?.resolved &&
      !milestone.flags?.disputed
    ) {
      return (
        <Badge variant="default">
          <Handshake className="h-3.5 w-3.5" />
          <span>Resolved</span>
        </Badge>
      );
    }
    if (
      ("flags" in milestone && milestone.flags?.approved) ||
      ("approved" in milestone && milestone.approved)
    ) {
      return (
        <Badge variant="default">
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Approved</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Layers className="h-3.5 w-3.5" />
        <span className="uppercase">
          {milestone.status
            ? milestone.status.match(/[a-z][A-Z]/)
              ? milestone.status.replace(/([A-Z])/g, " $1").toLowerCase()
              : milestone.status.toLowerCase()
            : ""}
        </span>
      </Badge>
    );
  };

  const getActionButtons = (
    milestone: SingleReleaseMilestone | MultiReleaseMilestone,
    milestoneIndex: number,
    userRolesInEscrow: string[],
  ) => {
    const buttons = [] as React.ReactNode[];
    const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

    if (
      userRolesInEscrow.includes("serviceProvider") &&
      activeTab === "serviceProvider" &&
      milestone.status !== "completed" &&
      !("flags" in milestone && milestone.flags?.approved)
    ) {
      buttons.push(
        <ChangeMilestoneStatusDialog
          key={`change-status-${milestoneIndex}`}
          milestoneIndex={milestoneIndex}
        />,
      );
    }

    if (
      userRolesInEscrow.includes("approver") &&
      activeTab === "approver" &&
      (("approved" in milestone && !milestone.approved) ||
        ("flags" in milestone &&
          !milestone.flags?.approved &&
          !milestone.flags?.disputed &&
          !milestone.flags?.released &&
          !milestone.flags?.resolved))
    ) {
      buttons.push(
        <ApproveMilestoneButton
          key={`approve-${milestoneIndex}`}
          milestoneIndex={milestoneIndex}
        />,
      );
    }

    if (
      userRolesInEscrow.includes("releaseSigner") &&
      activeTab === "releaseSigner" &&
      "flags" in milestone &&
      !milestone.flags?.disputed &&
      milestone.flags?.approved &&
      !milestone.flags?.released
    ) {
      buttons.push(
        // You can add the button here, using the button from the blocks. This button is conditional based on the milestone status and the user roles. Works only with multi-release escrows.

        <ReleaseMilestoneButton
          key={`release-${milestoneIndex}`}
          milestoneIndex={milestoneIndex}
        />,
      );
    }

    if (
      ((activeTab === "approver" && userRolesInEscrow.includes("approver")) ||
        (activeTab === "serviceProvider" &&
          userRolesInEscrow.includes("serviceProvider"))) &&
      "flags" in milestone &&
      !milestone.flags?.disputed &&
      !milestone.flags?.released &&
      !milestone.flags?.resolved
    ) {
      buttons.push(
        // You can add the button here, using the button from the blocks. This button is conditional based on the milestone status and the user roles. Works only with multi-release escrows.

        <DisputeMilestoneButton
          key={`dispute-${milestoneIndex}`}
          milestoneIndex={milestoneIndex}
        />,
      );
    }

    if (
      userRolesInEscrow.includes("disputeResolver") &&
      "flags" in milestone &&
      milestone.flags?.disputed
    ) {
      buttons.push(
        // You can add the button here, using the button from the blocks. This button is conditional based on the milestone status and the user roles. Works only with multi-release escrows.

        <ResolveDisputeDialog
          key={`resolve-${milestoneIndex}`}
          milestoneIndex={milestoneIndex}
        />,
      );
    }

    return buttons;
  };

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
        {"amount" in milestone && (
          <div className="flex items-center gap-2 py-2">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(milestone.amount, selectedEscrow.trustline?.name)}
            </span>
          </div>
        )}

        {milestone.evidence && (
          <div className="flex items-center gap-2 p-2 border-primary/20 rounded-lg">
            <FileCheck2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              Evidence provided
            </span>
          </div>
        )}

        {getActionButtons(milestone, milestoneIndex, userRolesInEscrow)}

        <Button
          size="sm"
          variant="outline"
          className="w-full border-border text-muted-foreground cursor-pointer"
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

export const MilestoneCard = React.memo(
  MilestoneCardComponent,
  (prev, next) => {
    if (
      prev.milestone === next.milestone &&
      prev.milestoneIndex === next.milestoneIndex &&
      prev.selectedEscrow?.contractId === next.selectedEscrow?.contractId &&
      prev.onViewDetails === next.onViewDetails &&
      prev.userRolesInEscrow.length === next.userRolesInEscrow.length &&
      prev.userRolesInEscrow.every((r, i) => r === next.userRolesInEscrow[i])
    ) {
      return true;
    }
    return false;
  },
);
