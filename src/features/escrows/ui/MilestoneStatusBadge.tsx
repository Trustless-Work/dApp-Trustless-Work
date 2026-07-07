import { Badge } from "@/components/ui/badge";
import type {
  MilestoneCardDisplayStatus,
  MilestoneDisplayStatus,
} from "@/features/escrows/utils/escrow-display.helper";
import {
  getMilestoneCardStatusBadgeVariant,
  getMilestoneCardStatusLabel,
  getMilestoneStatusBadgeVariant,
} from "@/features/escrows/utils/escrow-display.helper";
import { cn } from "@/lib/utils";

type MilestoneStatusBadgeProps = {
  status: MilestoneDisplayStatus;
  className?: string;
};

export const MilestoneStatusBadge = ({
  status,
  className,
}: MilestoneStatusBadgeProps) => (
  <Badge
    variant={getMilestoneStatusBadgeVariant(status)}
    className={cn("uppercase", className)}
  >
    {status}
  </Badge>
);

type MilestoneCardStatusBadgeProps = {
  status: MilestoneCardDisplayStatus;
  className?: string;
};

export const MilestoneCardStatusBadge = ({
  status,
  className,
}: MilestoneCardStatusBadgeProps) => (
  <Badge
    variant={getMilestoneCardStatusBadgeVariant(status)}
    className={cn("shrink-0 uppercase", className)}
  >
    {getMilestoneCardStatusLabel(status)}
  </Badge>
);
