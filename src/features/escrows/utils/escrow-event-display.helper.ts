import {
  BanknoteIcon,
  CheckCircle2Icon,
  FilePenLineIcon,
  FlagIcon,
  GavelIcon,
  RocketIcon,
  ScaleIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react";

const EVENT_LABELS: Record<string, string> = {
  deploy: "DEPLOYED",
  fund: "FUNDED",
  update: "UPDATED",
  approve: "APPROVED",
  release: "RELEASED",
  dispute: "DISPUTE STARTED",
  resolve: "DISPUTE RESOLVED",
  withdraw: "WITHDRAWN",
  change_status: "STATUS CHANGED",
  changeMilestoneStatus: "STATUS CHANGED",
  manage_milestones: "MILESTONES UPDATED",
  manageMilestones: "MILESTONES UPDATED",
};

const EVENT_ICONS: Record<string, LucideIcon> = {
  deploy: RocketIcon,
  fund: BanknoteIcon,
  update: FilePenLineIcon,
  approve: CheckCircle2Icon,
  release: FlagIcon,
  dispute: GavelIcon,
  resolve: ScaleIcon,
  withdraw: Undo2Icon,
};

export function getEscrowEventLabel(kind: string): string {
  const normalized = kind.trim();
  if (EVENT_LABELS[normalized]) {
    return EVENT_LABELS[normalized];
  }

  const spaced = normalized
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  if (!spaced) {
    return "EVENT";
  }

  return spaced.toUpperCase();
}

export function getEscrowEventIcon(kind: string): LucideIcon {
  return EVENT_ICONS[kind] ?? FlagIcon;
}
