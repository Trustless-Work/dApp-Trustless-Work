"use client";

import { Badge } from "@/components/ui/badge";
import {
  getMilestoneStatusText,
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

  return (
    <Badge
      variant="secondary"
      className={cn("max-w-40 truncate font-normal normal-case", className)}
      title={status}
    >
      {status}
    </Badge>
  );
};

