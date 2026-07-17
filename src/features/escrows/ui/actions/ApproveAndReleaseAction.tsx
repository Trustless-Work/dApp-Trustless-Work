"use client";

import { useState } from "react";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { formatMilestoneNumbers } from "@/features/escrows/utils/milestone-batch.helper";

export const ApproveAndReleaseAction = ({
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
  const { approveAndRelease, loading, walletAddress } =
    useEscrowActionsContext();

  if (!isStoredMultiReleaseEscrow(escrow) || milestoneIndexes.length === 0) {
    return null;
  }

  const isBatch = milestoneIndexes.length > 1;
  const numbers = formatMilestoneNumbers(milestoneIndexes);

  const handleConfirm = async () => {
    if (!walletAddress) {
      return;
    }

    const result = await approveAndRelease({
      contractId: escrow.contractId,
      signer: walletAddress,
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
        label={label ?? "Approve & Release"}
        triggerMode={triggerMode}
        triggerVariant={triggerVariant ?? "primary"}
        icon={icon}
        compact={compact}
        onActivate={() => setConfirmOpen(true)}
      />

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          isBatch ? "Approve and Release Milestones?" : "Approve and Release?"
        }
        description={
          isBatch
            ? `This atomically approves and releases milestones ${numbers}. The action is irreversible.`
            : "This atomically approves and releases the selected milestone. The action is irreversible."
        }
        confirmLabel="Approve and Release"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
