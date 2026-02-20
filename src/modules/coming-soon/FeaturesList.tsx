import { Badge } from "@/ui/badge";
import {
  Zap,
  Shield,
  Globe,
  Layers,
  Wallet,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Support Multiple Addresses per Role",
    description:
      "Roles can now be assigned to multiple addresses, enabling greater flexibility and shared permissions within escrow participants.",
    status: "Planned",
  },
  {
    icon: Zap,
    title: "Action-Based Timestamps",
    description:
      "Added timestamps for key lifecycle events such as release, approval, and status changes to improve traceability and auditing.",
    status: "Planned",
  },
  {
    icon: Shield,
    title: "Event-Driven Data Indexer",
    description:
      "Implemented an indexer that listens to smart contract events to synchronize and structure escrow data efficiently.",
    status: "Planned",
  },
  {
    icon: Clock,
    title: "Batch Approve, Release & Status Updates",
    description:
      "Introduced batch operations for approve, release, and status changes to optimize gas usage and streamline multi-escrow workflows.",
    status: "Planned",
  },
  {
    icon: Globe,
    title: "New UI Component Blocks",
    description:
      "Added new modular UI blocks to enhance integration flexibility and improve developer experience.",
    status: "In Development",
  },
  {
    icon: Layers,
    title: "Role Rename: platformAddress → platform",
    description:
      "Renamed platformAddress to platform for improved clarity and cleaner role semantics across the system.",
    status: "Planned",
  },
];

export const FeatureList = () => {
  return (
    <div className="grid w-full gap-px rounded-lg border border-border bg-border overflow-hidden sm:grid-cols-2">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-col gap-3 bg-card p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
              <feature.icon className="h-4 w-4 text-foreground" />
            </div>
            <Badge
              variant={
                feature.status === "In Development" ? "default" : "outline"
              }
            >
              {feature.status}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};
