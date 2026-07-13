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
import { useWithdrawFundsForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { WithdrawFundsFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";

export const WithdrawFundsAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const form = useWithdrawFundsForm();
  const { withdraw, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = form.handleSubmit(
    async (values: WithdrawFundsFormData) => {
      if (!walletAddress) {
        return;
      }

      const result = await withdraw({
        contractId: escrow.contractId,
        disputeResolver: walletAddress,
        distributions: [
          {
            address: values.address,
            amount: values.amount,
          },
        ],
      });

      if (result) {
        setOpen(false);
        form.reset({ address: "", amount: "" });
      }
    },
  );

  return (
    <>
      <ActionTrigger
        label="Withdraw Remaining"
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
            form.reset({ address: "", amount: "" });
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Withdraw Remaining Funds</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="withdraw-address">Recipient</Label>
                <Input
                  id="withdraw-address"
                  placeholder="G…"
                  {...form.register("address")}
                />
                {form.formState.errors.address ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g. 250"
                  {...form.register("amount")}
                />
                {form.formState.errors.amount ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.amount.message}
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
                Withdraw
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
