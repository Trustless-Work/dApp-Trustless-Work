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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStartDisputeForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { StartDisputeFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type {
  EscrowActionProps,
  EscrowMilestoneActionProps,
} from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { ConfirmActionDialog } from "@/features/escrows/ui/actions/ConfirmActionDialog";

type StartDisputeActionProps = EscrowActionProps | EscrowMilestoneActionProps;

function hasMilestoneIndex(
  props: StartDisputeActionProps,
): props is EscrowMilestoneActionProps {
  return "milestoneIndex" in props;
}

export const StartDisputeAction = (props: StartDisputeActionProps) => {
  const { escrow, triggerVariant, icon, triggerMode = "button" } = props;
  const milestoneIndex = hasMilestoneIndex(props)
    ? props.milestoneIndex
    : undefined;
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useStartDisputeForm();
  const { dispute, disputeBatch, loading, walletAddress } =
    useEscrowActionsContext();

  if (isMulti && milestoneIndex === undefined) {
    return null;
  }

  const handleConfirm = async () => {
    const isValid = await form.trigger();
    if (!isValid || !walletAddress) {
      return;
    }

    const values = form.getValues() as StartDisputeFormData;

    const result = isMulti
      ? await disputeBatch({
          contractId: escrow.contractId,
          signer: walletAddress,
          reason: values.reason,
          milestoneIndexes: [milestoneIndex ?? 0],
        })
      : await dispute({
          contractId: escrow.contractId,
          signer: walletAddress,
          reason: values.reason,
        });

    if (result) {
      setConfirmOpen(false);
      setOpen(false);
      form.reset({ reason: "" });
    }
  };

  return (
    <>
      <ActionTrigger
        label="Start Dispute"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        destructive
        onActivate={() => setOpen(true)}
      />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            form.reset({ reason: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Dispute</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <Label htmlFor="dispute-reason">Reason</Label>
            <Textarea
              id="dispute-reason"
              rows={3}
              placeholder="Explain why this dispute is being opened"
              {...form.register("reason")}
            />
            {form.formState.errors.reason ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.reason.message}
              </p>
            ) : null}
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
            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                void form.trigger().then((valid) => {
                  if (valid) {
                    setConfirmOpen(true);
                  }
                });
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Start Dispute?"
        description="Disputes trigger on-chain arbitration. This action cannot be undone casually."
        confirmLabel="Start Dispute"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
};
