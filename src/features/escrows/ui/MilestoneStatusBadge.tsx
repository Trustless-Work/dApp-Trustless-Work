"use client";

import { Badge } from "@/components/ui/badge";
import {
  getMilestoneStatusText,
  isMilestoneReleased,
  type EscrowMilestone,
} from "@/features/escrows/utils/escrow-milestone.helper";
import { cn } from "@/lib/utils";

type MilestoneStatusBadgeProps = {
  milestone: EscrowMilestone;
  className?: string;
};

export const MilestoneStatusBadge = ({
  milestone,
  className,
}: MilestoneStatusBadgeProps) => {
  const status = getMilestoneStatusText(milestone);

  if (!status) {
    return (
      <span className="text-sm text-muted-foreground" aria-label="No status">
        —
      </span>
    );
  }

  const normalized = status.trim().toLowerCase();
  const variant =
    isMilestoneReleased(milestone) || normalized === "released"
      ? "success"
      : "secondary";

  return (
    <Badge
      variant={variant}
      className={cn("max-w-40 truncate font-normal normal-case", className)}
      title={status}
    >
      {status}
    </Badge>
  );
};
