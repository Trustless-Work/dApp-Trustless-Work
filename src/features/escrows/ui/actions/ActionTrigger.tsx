"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type {
  EscrowActionTriggerMode,
  EscrowActionVariant,
} from "@/features/escrows/types/escrow-action.types";
import { EscrowActionTrigger } from "@/features/escrows/ui/detail/EscrowActionTrigger";

type ActionTriggerProps = {
  label: string;
  triggerMode?: EscrowActionTriggerMode;
  triggerVariant?: EscrowActionVariant;
  icon?: LucideIcon;
  destructive?: boolean;
  compact?: boolean;
  onActivate: () => void;
  children?: ReactNode;
};

export const ActionTrigger = ({
  label,
  triggerMode = "button",
  triggerVariant,
  icon,
  destructive = false,
  compact = false,
  onActivate,
  children,
}: ActionTriggerProps) => {
  if (triggerMode === "menu-item") {
    const Icon = icon;

    return (
      <DropdownMenuItem
        variant={destructive ? "destructive" : "default"}
        className="cursor-pointer gap-2.5 px-2.5 py-2.5"
        onSelect={(event) => {
          event.preventDefault();
          onActivate();
        }}
      >
        {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
        {label}
      </DropdownMenuItem>
    );
  }

  if (children) {
    return <>{children}</>;
  }

  if (compact) {
    const Icon = icon;
    const variant =
      triggerVariant === "primary"
        ? "default"
        : triggerVariant === "danger" || destructive
          ? "destructive"
          : "outline";

    return (
      <Button
        type="button"
        size="sm"
        variant={variant}
        className="shrink-0"
        onClick={onActivate}
      >
        {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
        {label}
      </Button>
    );
  }

  return (
    <EscrowActionTrigger
      variant={triggerVariant ?? (destructive ? "danger" : "secondary")}
      icon={icon}
      onClick={onActivate}
    >
      {label}
    </EscrowActionTrigger>
  );
};
