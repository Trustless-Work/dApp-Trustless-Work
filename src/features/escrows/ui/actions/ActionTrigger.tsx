"use client";

import type { ReactNode } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type {
  EscrowActionTriggerMode,
  EscrowActionVariant,
} from "@/features/escrows/types/escrow-action.types";
import { EscrowActionTrigger } from "@/features/escrows/ui/detail/EscrowActionTrigger";
import type { LucideIcon } from "lucide-react";

type ActionTriggerProps = {
  label: string;
  triggerMode?: EscrowActionTriggerMode;
  triggerVariant?: EscrowActionVariant;
  icon?: LucideIcon;
  destructive?: boolean;
  onActivate: () => void;
  children?: ReactNode;
};

export const ActionTrigger = ({
  label,
  triggerMode = "button",
  triggerVariant,
  icon,
  destructive = false,
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
