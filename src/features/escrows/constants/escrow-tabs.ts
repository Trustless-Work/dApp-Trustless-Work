import type { LucideIcon } from "lucide-react";
import { Layers2, LayersIcon } from "lucide-react";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

export type EscrowTabConfig = {
  value: EscrowType;
  label: string;
  icon: LucideIcon;
};

export const ESCROW_TABS: EscrowTabConfig[] = [
  {
    value: "single-release",
    label: "Single Release",
    icon: Layers2,
  },
  {
    value: "multi-release",
    label: "Multi Release",
    icon: LayersIcon,
  },
];
