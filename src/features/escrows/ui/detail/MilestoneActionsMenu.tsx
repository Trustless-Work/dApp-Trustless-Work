"use client";

import {
  BadgeCheck,
  CircleDollarSign,
  Gavel,
  ListChecks,
  MoreHorizontal,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ApproveAndReleaseAction } from "@/features/escrows/ui/actions/ApproveAndReleaseAction";
import { ApproveMilestoneAction } from "@/features/escrows/ui/actions/ApproveMilestoneAction";
import { ChangeMilestoneStatusAction } from "@/features/escrows/ui/actions/ChangeMilestoneStatusAction";
import { ReleaseFundsAction } from "@/features/escrows/ui/actions/ReleaseFundsAction";
import { ResolveDisputeAction } from "@/features/escrows/ui/actions/ResolveDisputeAction";
import { StartDisputeAction } from "@/features/escrows/ui/actions/StartDisputeAction";

type MilestoneActionsMenuProps = {
  escrow: StoredEscrow;
  milestoneIndex: number;
};

export const MilestoneActionsMenu = ({
  escrow,
  milestoneIndex,
}: MilestoneActionsMenuProps) => {
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const milestoneProps = {
    escrow,
    milestoneIndex,
    triggerMode: "menu-item" as const,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 cursor-pointer rounded-full"
          aria-label={`Milestone ${milestoneIndex + 1} actions`}
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5">
        <DropdownMenuLabel>Milestone {milestoneIndex + 1}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ApproveMilestoneAction {...milestoneProps} icon={BadgeCheck} />
        <ChangeMilestoneStatusAction {...milestoneProps} icon={ListChecks} />

        {isMulti ? (
          <>
            <DropdownMenuSeparator />
            <ApproveAndReleaseAction
              {...milestoneProps}
              triggerVariant="primary"
              icon={Zap}
            />
            <ReleaseFundsAction
              {...milestoneProps}
              triggerVariant="primary"
              icon={CircleDollarSign}
            />
            <DropdownMenuSeparator />
            <StartDisputeAction
              {...milestoneProps}
              triggerVariant="danger"
              icon={ShieldAlert}
            />
            <ResolveDisputeAction {...milestoneProps} icon={Gavel} />
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
