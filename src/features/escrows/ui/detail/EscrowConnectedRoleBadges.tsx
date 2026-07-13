"use client";

import Link from "next/link";
import {
  ESCROW_ROLE_ICONS,
  ESCROW_ROLE_LABELS,
  getEscrowRoleHelpHref,
} from "@/constants/escrow-roles.constants";
import { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWalletContext } from "@/providers/WalletProvider";
import { cn } from "@/lib/utils";

type EscrowConnectedRoleBadgesProps = {
  escrow: StoredEscrow;
  className?: string;
};

const iconLinkClassName =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted";

export const EscrowConnectedRoleBadges = ({
  escrow,
  className,
}: EscrowConnectedRoleBadgesProps) => {
  const { walletAddress } = useWalletContext();
  const roleIds = new EscrowRoleContext(escrow, walletAddress).getConnectedRoleIds();

  if (roleIds.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex shrink-0 flex-wrap items-center gap-2", className)}
      aria-label="Your roles on this escrow"
    >
      {roleIds.map((roleId) => {
        const Icon = ESCROW_ROLE_ICONS[roleId];
        const label = ESCROW_ROLE_LABELS[roleId];

        return (
          <Tooltip key={roleId}>
            <TooltipTrigger asChild>
              <Link
                href={getEscrowRoleHelpHref(roleId)}
                className={iconLinkClassName}
                aria-label={`${label} role — view help`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
