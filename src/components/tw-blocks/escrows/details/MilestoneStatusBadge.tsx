"use client";

import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import { Badge } from "@/ui/badge";
import {
  CircleAlert,
  CircleCheckBig,
  Handshake,
  CheckCheck,
  Layers,
} from "lucide-react";

interface MilestoneStatusBadgeProps {
  milestone: SingleReleaseMilestone | MultiReleaseMilestone;
}

export const MilestoneStatusBadge = ({ milestone }: MilestoneStatusBadgeProps) => {
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
