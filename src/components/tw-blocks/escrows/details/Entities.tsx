"use client";

import {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { EntityCard } from "./EntityCard";
import { Separator } from "@/ui/separator";

interface EntitiesProps {
  selectedEscrow: Escrow;
}

export const Entities = ({ selectedEscrow }: EntitiesProps) => {
  const receivers =
    selectedEscrow.type === "single-release"
      ? (selectedEscrow.roles as { receiver?: string })?.receiver
        ? [(selectedEscrow.roles as { receiver?: string }).receiver as string]
        : []
      : (selectedEscrow.milestones || [])
          .map((m) => (m as MultiReleaseMilestone | undefined)?.receiver)
          .filter((r): r is string => Boolean(r));

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Entities</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EntityCard
          type="approver"
          entity={selectedEscrow.roles?.approver}
          inDispute={selectedEscrow.flags?.disputed}
        />
        <EntityCard
          type="serviceProvider"
          entity={selectedEscrow.roles?.serviceProvider}
          inDispute={selectedEscrow.flags?.disputed}
        />
        <EntityCard
          type="disputeResolver"
          entity={selectedEscrow.roles?.disputeResolver}
        />
        <EntityCard
          type="platformAddress"
          entity={selectedEscrow.roles?.platformAddress}
          hasPercentage
          percentage={selectedEscrow.platformFee}
        />
        <EntityCard
          type="releaseSigner"
          entity={selectedEscrow.roles?.releaseSigner}
        />
      </div>

      <Separator className="my-4" />

      <h2 className="text-lg font-semibold">Receivers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {receivers.map((r, idx) => (
          <EntityCard key={`receiver-${idx}-${r}`} type="receiver" entity={r} />
        ))}
      </div>
    </>
  );
};
