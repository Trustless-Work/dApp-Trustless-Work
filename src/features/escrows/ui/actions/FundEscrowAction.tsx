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
import { useFundEscrowForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import type { FundEscrowFormData } from "@/features/escrows/schemas/escrow-action.schemas";

export const FundEscrowAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const form = useFundEscrowForm();
  const { fund, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = form.handleSubmit(async (values: FundEscrowFormData) => {
    if (!walletAddress) {
      return;
    }

    const result = await fund({
      contractId: escrow.contractId,
      signer: walletAddress,
      amount: values.amount,
    });

    if (result) {
      setOpen(false);
      form.reset({ amount: "" });
    }
  });

  return (
    <>
      <ActionTrigger
        label="Fund Escrow"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            form.reset({ amount: "" });
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Fund Escrow</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Label htmlFor="fund-amount">Amount</Label>
              <Input
                id="fund-amount"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 500"
                {...form.register("amount")}
              />
              {form.formState.errors.amount ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
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
              <Button type="submit" disabled={loading}>
                Fund
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
