"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getMilestoneFlagBadgeVariant,
  getMilestoneFlagDotClassName,
  getMilestoneFlagLabel,
} from "@/features/escrows/utils/escrow-display.helper";
import {
  getMilestoneFlags,
  type EscrowMilestone,
} from "@/features/escrows/utils/escrow-milestone.helper";
import { cn } from "@/lib/utils";

type MilestoneFlagsBadgesProps = {
  milestone: EscrowMilestone;
  className?: string;
  /** When true, render nothing if there are no flags (useful in compact lists). */
  hideEmpty?: boolean;
  /** `dot` for compact lists; `badge` for detail surfaces (shows flag labels). */
  appearance?: "dot" | "badge";
};

export const MilestoneFlagsBadges = ({
  milestone,
  className,
  hideEmpty = false,
  appearance = "dot",
}: MilestoneFlagsBadgesProps) => {
  const flags = getMilestoneFlags(milestone);

  if (flags.length === 0) {
    if (hideEmpty) {
      return null;
    }

    return (
      <span className="text-sm text-muted-foreground" aria-label="No flags">
        —
      </span>
    );
  }

  if (appearance === "badge") {
    return (
      <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
        {flags.map((flag) => (
          <Badge
            key={flag}
            variant={getMilestoneFlagBadgeVariant(flag)}
            className="uppercase"
          >
            {getMilestoneFlagLabel(flag)}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {flags.map((flag) => {
        const label = getMilestoneFlagLabel(flag);

        return (
          <Tooltip key={flag}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "inline-flex size-2.5 shrink-0 rounded-full",
                  getMilestoneFlagDotClassName(flag),
                )}
                aria-label={label}
              />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
