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
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";

export const FundEscrowAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { fund, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const result = await fund({
      contractId: escrow.contractId,
      signer: walletAddress,
      amount: parsedAmount,
    });

    if (result) {
      setOpen(false);
      setAmount("");
    }
  };

  return (
    <>
      <ActionTrigger
        label="Fund Escrow"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Escrow</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fund-amount">Amount</Label>
            <Input
              id="fund-amount"
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 500"
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
              Fund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
