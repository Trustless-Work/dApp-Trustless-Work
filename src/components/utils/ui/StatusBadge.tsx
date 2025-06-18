import { Badge } from "@/components/ui/badge";
import {
  CircleAlert,
  CircleCheckBig,
  Handshake,
  Layers,
  TriangleAlert,
} from "lucide-react";
import { Escrow } from "@/@types/escrow.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";

export const getStatusBadge = (escrow: Escrow) => {
  const completedMilestones = escrow.milestones.filter(
    (milestone: MultiReleaseMilestone | SingleReleaseMilestone) =>
      milestone.status === "completed",
  ).length;

  const approvedMilestones = escrow.milestones.filter(
    (milestone: SingleReleaseMilestone | MultiReleaseMilestone) =>
      "flags" in milestone && milestone.flags?.approved === true,
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
      <Badge variant="destructive" className="gap-1">
        <CircleAlert className="h-3.5 w-3.5" />
        <span>In Dispute</span>
      </Badge>
    );
  }

  if (pendingRelease) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-yellow-500 text-yellow-600"
      >
        <TriangleAlert className="h-3.5 w-3.5" />
        <span>Pending Release</span>
      </Badge>
    );
  }

  if (escrow.flags?.released) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-green-500 text-green-600"
      >
        <CircleCheckBig className="h-3.5 w-3.5" />
        <span>Released</span>
      </Badge>
    );
  }

  if (escrow.flags?.resolved) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-green-500 text-green-600"
      >
        <Handshake className="h-3.5 w-3.5" />
        <span>Resolved</span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Layers className="h-3.5 w-3.5" />
      <span>Working</span>
    </Badge>
  );
};
