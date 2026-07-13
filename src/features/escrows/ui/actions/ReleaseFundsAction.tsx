"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type {
  EscrowActionProps,
  EscrowMilestoneActionProps,
} from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";

type ReleaseFundsActionProps = EscrowActionProps | EscrowMilestoneActionProps;

function hasMilestoneIndex(
  props: ReleaseFundsActionProps,
): props is EscrowMilestoneActionProps {
  return "milestoneIndex" in props;
}

export const ReleaseFundsAction = (props: ReleaseFundsActionProps) => {
  const {
    escrow,
    triggerVariant,
    icon,
    triggerMode = "button",
  } = props;
  const milestoneIndex = hasMilestoneIndex(props)
    ? props.milestoneIndex
    : undefined;
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { release, releaseBatch, loading, walletAddress } = useEscrowActionsContext();

  if (isMulti && milestoneIndex === undefined) {
    return null;
  }

  const handleConfirm = async () => {
    if (!walletAddress) {
      return;
    }

    const result = isMulti
      ? await releaseBatch({
          contractId: escrow.contractId,
          releaseSigner: walletAddress,
          milestoneIndexes: [milestoneIndex ?? 0],
        })
      : await release({
          contractId: escrow.contractId,
          releaseSigner: walletAddress,
        });

    if (result) {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <ActionTrigger
        label="Release Funds"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant ?? "primary"}
        icon={icon}
        onActivate={() => setConfirmOpen(true)}
      />

      {!isMulti ? (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Release Funds</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will release all approved funds for the escrow.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
              >
                Release Funds
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <ConfirmActionDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Release Funds?"
          description="Releasing funds is irreversible. Confirm that the milestone is approved."
          confirmLabel="Release Funds"
          loading={loading}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};
