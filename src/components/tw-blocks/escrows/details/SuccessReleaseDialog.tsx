"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { EntityCard } from "./EntityCard";
import { CircleCheckBig } from "lucide-react";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { useEscrowAmountContext } from "@/providers/EscrowAmountProvider";

interface SuccessReleaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuccessReleaseDialog = ({
  isOpen,
  onOpenChange,
}: SuccessReleaseDialogProps) => {
  const { selectedEscrow } = useEscrowContext();
  const {
    receiverAmount,
    platformFeeAmount,
    trustlessWorkAmount,
    lastReleasedMilestoneIndex,
  } = useEscrowAmountContext();

  const platformFee = Number(selectedEscrow?.platformFee || 0);
  const trustlessPercentage = 0.3;
  const receiverPercentage = 100 - (platformFee + trustlessPercentage);

  const currency = selectedEscrow?.trustline?.name ?? "";

  const cards = useMemo<
    Array<{
      type: string;
      entity?: string;
      percentage?: number;
      amount?: number;
    }>
  >(() => {
    const baseCards = [
      {
        type: "Platform",
        entity: selectedEscrow?.roles?.platformAddress,
        percentage: platformFee,
        amount: platformFeeAmount,
      },
      {
        type: "Trustless Work",
        entity: "Private",
        percentage: trustlessPercentage,
        amount: trustlessWorkAmount,
      },
    ];

    if (selectedEscrow?.type === "single-release") {
      return [
        ...baseCards,
        {
          type: "Receiver",
          entity: (selectedEscrow?.roles as { receiver?: string })?.receiver,
          percentage: receiverPercentage,
          amount: receiverAmount,
        },
      ];
    }

    // Multi-release: show only the receiver for the just-released milestone
    const idx =
      typeof lastReleasedMilestoneIndex === "number"
        ? lastReleasedMilestoneIndex
        : -1;
    const milestone = selectedEscrow?.milestones?.[idx] as
      | MultiReleaseMilestone
      | undefined;
    const receiverForReleased = milestone?.receiver;

    if (receiverForReleased) {
      return [
        ...baseCards,
        {
          type: "Receiver",
          entity: receiverForReleased,
          percentage: receiverPercentage,
          amount: receiverAmount,
        },
      ];
    }

    // Fallback: if no index available, list all receivers (legacy behavior)
    const receiverCards = (selectedEscrow?.milestones || [])
      .map((m) => (m as MultiReleaseMilestone | undefined)?.receiver)
      .filter((r): r is string => Boolean(r))
      .map((r) => ({ type: "Receiver", entity: r }));

    return [...baseCards, ...receiverCards];
  }, [
    platformFee,
    receiverPercentage,
    trustlessPercentage,
    platformFeeAmount,
    trustlessWorkAmount,
    receiverAmount,
    selectedEscrow?.roles?.platformAddress,
    selectedEscrow?.type,
    selectedEscrow?.milestones,
    selectedEscrow?.roles,
    lastReleasedMilestoneIndex,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleCheckBig className="h-5 w-5 text-green-600" />
            Release Successful
          </DialogTitle>
          <DialogDescription>
            Funds were distributed successfully to the corresponding parties.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {cards.map((c) => (
            <EntityCard
              key={`${c.type}-${c.entity ?? "unknown"}`}
              type={c.type}
              entity={c.entity}
              hasPercentage={c.percentage !== undefined}
              percentage={
                c.percentage !== undefined
                  ? Number(c.percentage.toFixed(2))
                  : undefined
              }
              hasAmount={c.amount !== undefined}
              amount={
                c.amount !== undefined ? Number(c.amount.toFixed(2)) : undefined
              }
              currency={currency}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
