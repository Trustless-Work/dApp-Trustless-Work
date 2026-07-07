import { Badge } from "@/components/ui/badge";
import { LiveStatusDot, type LiveStatusTone } from "@/components/shared/LiveStatusDot";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import {
  getEscrowCardStatusBadgeVariant,
  getEscrowStatusBadgeVariant,
  getEscrowStatusLabel,
  getEscrowTypeLabel,
  isEscrowDisputed,
  isEscrowReleased,
} from "@/features/escrows/utils/escrow-display.helper";
import { cn } from "@/lib/utils";

const activeEscrowStatusBadgeClassName =
  "border-transparent bg-foreground text-background hover:bg-foreground/90";

function isEscrowActive(escrow: StoredEscrow): boolean {
  return !isEscrowDisputed(escrow) && !isEscrowReleased(escrow);
}

function getEscrowStatusTone(escrow: StoredEscrow): LiveStatusTone {
  if (isEscrowDisputed(escrow)) {
    return "disputed";
  }

  if (isEscrowReleased(escrow)) {
    return "released";
  }

  return "active";
}

function getEscrowCardStatusTone(
  status: "active" | "released" | "disputed",
): LiveStatusTone {
  return status;
}

type EscrowStatusBadgeProps = {
  escrow: StoredEscrow;
  className?: string;
};

export const EscrowStatusBadge = ({
  escrow,
  className,
}: EscrowStatusBadgeProps) => {
  const isActive = isEscrowActive(escrow);

  return (
    <Badge
      variant={isActive ? "outline" : getEscrowStatusBadgeVariant(escrow)}
      className={cn(
        "gap-1.5 uppercase",
        isActive && activeEscrowStatusBadgeClassName,
        className,
      )}
    >
      <LiveStatusDot tone={getEscrowStatusTone(escrow)} />
      {getEscrowStatusLabel(escrow)}
    </Badge>
  );
};

type EscrowCardStatusBadgeProps = {
  status: "active" | "released" | "disputed";
  className?: string;
};

export const EscrowCardStatusBadge = ({
  status,
  className,
}: EscrowCardStatusBadgeProps) => {
  const isActive = status === "active";

  return (
    <Badge
      variant={isActive ? "outline" : getEscrowCardStatusBadgeVariant(status)}
      className={cn(
        "gap-1.5 uppercase",
        isActive && activeEscrowStatusBadgeClassName,
        className,
      )}
    >
      <LiveStatusDot tone={getEscrowCardStatusTone(status)} />
      {status === "active"
        ? "Active"
        : status === "released"
          ? "Released"
          : "Disputed"}
    </Badge>
  );
};

type EscrowTypeBadgeProps = {
  escrow: StoredEscrow;
  className?: string;
};

export const EscrowTypeBadge = ({ escrow, className }: EscrowTypeBadgeProps) => (
  <Badge variant="outline" className={cn("uppercase", className)}>
    {getEscrowTypeLabel(escrow.type)}
  </Badge>
);
