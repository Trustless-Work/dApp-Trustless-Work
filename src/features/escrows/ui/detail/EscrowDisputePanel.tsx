"use client";

import { Badge } from "@/components/ui/badge";
import { EscrowLongTextBlock } from "@/features/escrows/ui/detail/EscrowLongTextBlock";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredSingleReleaseEscrow } from "@/features/escrows/types/escrow.types";
import {
  getEscrowDisputeReason,
  hasEscrowDispute,
} from "@/features/escrows/utils/escrow-milestone.helper";

type EscrowDisputePanelProps = {
  escrow: StoredEscrow;
};

export const EscrowDisputePanel = ({ escrow }: EscrowDisputePanelProps) => {
  if (!isStoredSingleReleaseEscrow(escrow) || !hasEscrowDispute(escrow)) {
    return null;
  }

  const dispute = escrow.dispute;
  if (!dispute) {
    return null;
  }

  const reason = getEscrowDisputeReason(escrow);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Dispute</h2>
        {dispute.isDisputed ? (
          <Badge variant="destructive" className="uppercase">
            Open
          </Badge>
        ) : null}
        {dispute.resolved ? (
          <Badge variant="secondary" className="uppercase">
            Resolved
          </Badge>
        ) : null}
      </div>
      {reason ? (
        <div className="mt-5">
          <EscrowLongTextBlock label="Reason" value={reason} />
        </div>
      ) : null}
    </section>
  );
};
