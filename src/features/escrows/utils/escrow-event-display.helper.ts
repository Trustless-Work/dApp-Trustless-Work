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
  deploy: "Deployed",
  fund: "Funded",
  update: "Updated",
  approve: "Approved",
  release: "Released",
  dispute: "Dispute started",
  resolve: "Dispute resolved",
  withdraw: "Withdrawn",
  change_status: "Status changed",
  changeMilestoneStatus: "Status changed",
  manage_milestones: "Milestones updated",
  manageMilestones: "Milestones updated",
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
    return "Event";
  }

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function getEscrowEventIcon(kind: string): LucideIcon {
  return EVENT_ICONS[kind] ?? FlagIcon;
}
