"use client";

import { DiscIcon } from "lucide-react";
import { NoData } from "@/components/shared/NoData";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

type EscrowsSectionProps = {
  escrowType: EscrowType;
  onCreateRequest: () => void;
};

const EMPTY_STATE_COPY: Record<
  EscrowType,
  { title: string; description: string }
> = {
  "single-release": {
    title: "No single-release escrows yet",
    description:
      "Create a single-release escrow to release all funds once milestones are approved.",
  },
  "multi-release": {
    title: "No multi-release escrows yet",
    description:
      "Create a multi-release escrow to release funds milestone by milestone.",
  },
};

export const EscrowsSection = ({
  escrowType,
  onCreateRequest,
}: EscrowsSectionProps) => {
  const copy = EMPTY_STATE_COPY[escrowType];

  return (
    <NoData
      icon={DiscIcon}
      title={copy.title}
      description={copy.description}
      actionLabel="Create escrow"
      onAction={onCreateRequest}
    />
  );
};
