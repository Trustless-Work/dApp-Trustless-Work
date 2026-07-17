"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useResolveDisputeForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { ResolveDisputeFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type {
  EscrowActionProps,
  EscrowMilestoneActionProps,
} from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { formatMilestoneNumbers } from "@/features/escrows/utils/milestone-batch.helper";

type ResolveDisputeActionProps = EscrowActionProps | EscrowMilestoneActionProps;

function hasMilestoneIndexes(
  props: ResolveDisputeActionProps,
): props is EscrowMilestoneActionProps {
  return "milestoneIndexes" in props;
}

export const ResolveDisputeAction = (props: ResolveDisputeActionProps) => {
  const {
    escrow,
    triggerVariant,
    icon,
    triggerMode = "button",
    label,
    compact,
    onSuccess,
  } = props;
  const milestoneIndexes = hasMilestoneIndexes(props)
    ? props.milestoneIndexes
    : undefined;
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const [open, setOpen] = useState(false);
  const form = useResolveDisputeForm();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });
  const { resolve, loading, walletAddress } = useEscrowActionsContext();

  if (isMulti && (!milestoneIndexes || milestoneIndexes.length === 0)) {
    return null;
  }

  const isBatch = (milestoneIndexes?.length ?? 0) > 1;
  const numbers = milestoneIndexes
    ? formatMilestoneNumbers(milestoneIndexes)
    : "";

  const handleSubmit = form.handleSubmit(
    async (values: ResolveDisputeFormData) => {
      if (!walletAddress) {
        return;
      }

      const result = isMulti
        ? await resolve({
            contractId: escrow.contractId,
            disputeResolver: walletAddress,
            distributions: values.rows,
            milestoneIndexes: milestoneIndexes ?? [],
          })
        : await resolve({
            contractId: escrow.contractId,
            disputeResolver: walletAddress,
            distributions: values.rows,
          });

      if (result) {
        setOpen(false);
        form.reset({ rows: [{ address: "", amount: "" }] });
        onSuccess?.();
      }
    },
  );

  return (
    <>
      <ActionTrigger
        label={label ?? "Resolve Dispute"}
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
            form.reset({ rows: [{ address: "", amount: "" }] });
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isBatch ? "Resolve Disputes" : "Resolve Dispute"}
              </DialogTitle>
            </DialogHeader>
            {isBatch ? (
              <p className="text-sm text-muted-foreground">
                Resolves disputes for milestones {numbers} with the same
                distributions.
              </p>
            ) : null}

            <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto py-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_140px_auto]"
                >
                  <div className="flex flex-col gap-1">
                    <Input
                      placeholder="Recipient G…"
                      {...form.register(`rows.${index}.address`)}
                    />
                    {form.formState.errors.rows?.[index]?.address ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.rows[index]?.address?.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="Amount"
                      {...form.register(`rows.${index}.amount`)}
                    />
                    {form.formState.errors.rows?.[index]?.amount ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.rows[index]?.amount?.message}
                      </p>
                    ) : null}
                  </div>
                  {fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon />
                    </Button>
                  ) : null}
                </div>
              ))}

              {form.formState.errors.rows?.root ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.rows.root.message}
                </p>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => append({ address: "", amount: "" })}
              >
                <PlusIcon />
                Add distribution
              </Button>
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
                Resolve Dispute
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
