import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import type { EscrowActionVariant } from "@/features/escrows/types/escrow-action.types";
import { cn } from "@/lib/utils";

export const escrowActionVariantClasses: Record<EscrowActionVariant, string> = {
  primary:
    "border-transparent bg-foreground text-background hover:opacity-90",
  secondary: "border-border bg-card text-foreground hover:bg-muted",
  danger:
    "border-destructive/30 bg-card text-destructive hover:bg-destructive/10",
};

type EscrowActionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: EscrowActionVariant;
  icon?: LucideIcon;
};

export const EscrowActionTrigger = ({
  variant = "secondary",
  icon: Icon,
  className,
  children,
  type = "button",
  ...props
}: EscrowActionTriggerProps) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex w-full cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        escrowActionVariantClasses[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      {children}
    </button>
  );
};
