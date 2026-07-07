"use client";

import { useState } from "react";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActions } from "@/features/escrows/hooks/useEscrowActions";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";

export const ApproveMilestoneAction = ({
  escrow,
  milestoneIndex,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowMilestoneActionProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { approve, loading, walletAddress } = useEscrowActions(
    escrow.contractId,
    escrow.type,
  );

  const handleConfirm = async () => {
    if (!walletAddress) {
      return;
    }

    const result = await approve({
      contractId: escrow.contractId,
      approver: walletAddress,
      milestoneIndexes: [milestoneIndex],
    });

    if (result) {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <ActionTrigger
        label="Approve Milestone"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setConfirmOpen(true)}
      />

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Approve Milestone?"
        description="Approving a milestone is irreversible on-chain. Make sure the deliverables meet your criteria."
        confirmLabel="Approve Milestone"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
