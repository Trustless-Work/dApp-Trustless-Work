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
import { useEscrowActionPolicy } from "@/features/escrows/hooks/useEscrowActionPolicy";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { ManageMilestonesForm } from "@/features/escrows/ui/actions/ManageMilestonesForm";
import {
  buildExistingMilestoneRows,
  buildManageMilestonesPayload,
  filterValidNewMilestoneRows,
  hasExistingMilestoneChanges,
  type ExistingMilestoneRow,
  type NewMilestoneRow,
} from "@/features/escrows/utils/manage-milestones.helper";

export const ManageMilestonesAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const policy = useEscrowActionPolicy(escrow);
  const canEditExisting = policy.canEditExistingMilestones();
  const [open, setOpen] = useState(false);
  const [existingRows, setExistingRows] = useState<ExistingMilestoneRow[]>(() =>
    buildExistingMilestoneRows(escrow),
  );
  const [newRows, setNewRows] = useState<NewMilestoneRow[]>([]);
  const { manageMilestones, loading, walletAddress } = useEscrowActionsContext();

  const resetForm = () => {
    setExistingRows(buildExistingMilestoneRows(escrow));
    setNewRows([]);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }

    const validNewRows = filterValidNewMilestoneRows(newRows, isMulti);
    const hasChanges = canEditExisting
      ? hasExistingMilestoneChanges(escrow, existingRows, isMulti) ||
        validNewRows.length > 0
      : validNewRows.length > 0;

    if (!hasChanges) {
      return;
    }

    const payload = buildManageMilestonesPayload(
      escrow,
      walletAddress,
      existingRows,
      newRows,
      canEditExisting,
    );

    const result = await manageMilestones(payload);

    if (result) {
      setOpen(false);
      resetForm();
    }
  };

  return (
    <>
      <ActionTrigger
        label="Manage Milestones"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => handleOpenChange(true)}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Milestones</DialogTitle>
          </DialogHeader>

          <ManageMilestonesForm
            isMulti={isMulti}
            canEditExisting={canEditExisting}
            existingRows={existingRows}
            newRows={newRows}
            onExistingRowsChange={setExistingRows}
            onNewRowsChange={setNewRows}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={loading} onClick={handleSubmit}>
              Save milestones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
