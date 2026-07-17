import type { LucideIcon } from "lucide-react";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";

export type EscrowActionVariant = "primary" | "secondary" | "danger";

export type EscrowActionTriggerMode = "button" | "menu-item";

export type EscrowActionProps = {
  escrow: StoredEscrow;
  triggerVariant?: EscrowActionVariant;
  icon?: LucideIcon;
  triggerMode?: EscrowActionTriggerMode;
  /** Overrides the default trigger label (e.g. batch “Approve (3)”). */
  label?: string;
  /** Compact button for batch toolbars. */
  compact?: boolean;
  /** Called after a successful on-chain action (e.g. clear selection). */
  onSuccess?: () => void;
};

export type EscrowMilestoneActionProps = EscrowActionProps & {
  milestoneIndexes: number[];
};
