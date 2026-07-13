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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";

export const ChangeMilestoneStatusAction = ({
  escrow,
  milestoneIndex,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowMilestoneActionProps) => {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const { changeStatus, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = async () => {
    if (!walletAddress || !newStatus.trim()) {
      return;
    }

    const result = await changeStatus({
      contractId: escrow.contractId,
      serviceProvider: walletAddress,
      updates: [
        {
          index: milestoneIndex,
          newStatus: newStatus.trim(),
        },
      ],
    });

    if (result) {
      setOpen(false);
      setNewStatus("");
    }
  };

  return (
    <>
      <ActionTrigger
        label="Update Milestone Status"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Milestone Status</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`milestone-status-${milestoneIndex}`}>
              New status
            </Label>
            <Input
              id={`milestone-status-${milestoneIndex}`}
              value={newStatus}
              onChange={(event) => setNewStatus(event.target.value)}
              placeholder="In progress"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={loading} onClick={handleSubmit}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
