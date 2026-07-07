import type { EscrowRoleId } from "@/constants/escrow-roles.constants";
import { ESCROW_ROLE_ICONS } from "@/constants/escrow-roles.constants";
import { cn } from "@/lib/utils";

type EscrowRoleIconProps = {
  roleId: EscrowRoleId;
  className?: string;
};

export const EscrowRoleIcon = ({ roleId, className }: EscrowRoleIconProps) => {
  const Icon = ESCROW_ROLE_ICONS[roleId];

  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50",
        className,
      )}
      aria-hidden
    >
      <Icon className="size-4 text-foreground" />
    </div>
  );
};
