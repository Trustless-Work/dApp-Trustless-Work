"use client";

import { useState } from "react";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";
import { formatMilestoneNumbers } from "@/features/escrows/utils/milestone-batch.helper";

export const ApproveMilestoneAction = ({
  escrow,
  milestoneIndexes,
  triggerVariant,
  icon,
  triggerMode = "button",
  label,
  compact,
  onSuccess,
}: EscrowMilestoneActionProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { approve, loading, walletAddress } = useEscrowActionsContext();

  if (milestoneIndexes.length === 0) {
    return null;
  }

  const isBatch = milestoneIndexes.length > 1;
  const numbers = formatMilestoneNumbers(milestoneIndexes);

  const handleConfirm = async () => {
    if (!walletAddress) {
      return;
    }

    const result = await approve({
      contractId: escrow.contractId,
      approver: walletAddress,
      milestoneIndexes,
    });

    if (result) {
      setConfirmOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <ActionTrigger
        label={label ?? (isBatch ? "Approve Milestones" : "Approve Milestone")}
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        compact={compact}
        onActivate={() => setConfirmOpen(true)}
      />

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isBatch ? "Approve Milestones?" : "Approve Milestone?"}
        description={
          isBatch
            ? `Approving milestones ${numbers} is irreversible on-chain. Make sure the deliverables meet your criteria.`
            : "Approving a milestone is irreversible on-chain. Make sure the deliverables meet your criteria."
        }
        confirmLabel={
          isBatch ? "Approve Milestones" : "Approve Milestone"
        }
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
