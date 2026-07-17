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
import { Textarea } from "@/components/ui/textarea";
import { useChangeMilestoneStatusForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { ChangeMilestoneStatusFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { EscrowMilestoneActionProps } from "@/features/escrows/types/escrow-action.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { formatMilestoneNumbers } from "@/features/escrows/utils/milestone-batch.helper";

export const ChangeMilestoneStatusAction = ({
  escrow,
  milestoneIndexes,
  triggerVariant,
  icon,
  triggerMode = "button",
  label,
  compact,
  onSuccess,
}: EscrowMilestoneActionProps) => {
  const [open, setOpen] = useState(false);
  const form = useChangeMilestoneStatusForm();
  const { changeStatus, loading, walletAddress } = useEscrowActionsContext();

  if (milestoneIndexes.length === 0) {
    return null;
  }

  const isBatch = milestoneIndexes.length > 1;
  const numbers = formatMilestoneNumbers(milestoneIndexes);
  const fieldId = milestoneIndexes.join("-");

  const handleSubmit = form.handleSubmit(
    async (values: ChangeMilestoneStatusFormData) => {
      if (!walletAddress) {
        return;
      }

      const evidence = values.newEvidence?.trim();

      const result = await changeStatus({
        contractId: escrow.contractId,
        serviceProvider: walletAddress,
        updates: milestoneIndexes.map((index) => ({
          index,
          newStatus: values.newStatus,
          ...(evidence ? { newEvidence: evidence } : {}),
        })),
      });

      if (result) {
        setOpen(false);
        form.reset({ newStatus: "", newEvidence: "" });
        onSuccess?.();
      }
    },
  );

  return (
    <>
      <ActionTrigger
        label={
          label ??
          (isBatch ? "Update Milestone Statuses" : "Update Milestone Status")
        }
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        compact={compact}
        onActivate={() => setOpen(true)}
      />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            form.reset({ newStatus: "", newEvidence: "" });
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isBatch
                  ? "Change Milestone Statuses"
                  : "Change Milestone Status"}
              </DialogTitle>
            </DialogHeader>
            {isBatch ? (
              <p className="text-sm text-muted-foreground">
                Applies the same status to milestones {numbers}.
              </p>
            ) : null}
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`milestone-status-${fieldId}`}>
                  New status
                </Label>
                <Input
                  id={`milestone-status-${fieldId}`}
                  placeholder="In progress"
                  {...form.register("newStatus")}
                />
                {form.formState.errors.newStatus ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.newStatus.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`milestone-evidence-${fieldId}`}>
                  Evidence (optional)
                </Label>
                <Textarea
                  id={`milestone-evidence-${fieldId}`}
                  placeholder="URL or notes proving delivery"
                  rows={4}
                  {...form.register("newEvidence")}
                />
                {form.formState.errors.newEvidence ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.newEvidence.message}
                  </p>
                ) : null}
              </div>
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
              <Button type="submit" disabled={loading}>
                Update Status
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
