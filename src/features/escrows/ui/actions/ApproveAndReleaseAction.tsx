"use client";

import { useState } from "react";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";

export const ApproveAndReleaseAction = ({
  escrow,
  milestoneIndex,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowMilestoneActionProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { approveAndRelease, loading, walletAddress } =
    useEscrowActionsContext();

  if (!isStoredMultiReleaseEscrow(escrow)) {
    return null;
  }

  const handleConfirm = async () => {
    if (!walletAddress) {
      return;
    }

    const result = await approveAndRelease({
      contractId: escrow.contractId,
      signer: walletAddress,
      milestoneIndexes: [milestoneIndex],
    });

    if (result) {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <ActionTrigger
        label="Approve & Release"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant ?? "primary"}
        icon={icon}
        onActivate={() => setConfirmOpen(true)}
      />

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Approve and Release?"
        description="This atomically approves and releases the selected milestone. The action is irreversible."
        confirmLabel="Approve and Release"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
