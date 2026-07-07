import type { LucideIcon } from "lucide-react";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";

export type EscrowActionVariant = "primary" | "secondary" | "danger";

export type EscrowActionTriggerMode = "button" | "menu-item";

export type EscrowActionProps = {
  escrow: StoredEscrow;
  triggerVariant?: EscrowActionVariant;
  icon?: LucideIcon;
  triggerMode?: EscrowActionTriggerMode;
};

export type EscrowMilestoneActionProps = EscrowActionProps & {
  milestoneIndex: number;
};
