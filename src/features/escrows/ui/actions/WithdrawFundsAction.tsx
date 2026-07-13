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
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";

export const WithdrawFundsAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { withdraw, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }

    const parsedAmount = Number(amount);
    if (!address.trim() || !Number.isFinite(parsedAmount)) {
      return;
    }

    const result = await withdraw({
      contractId: escrow.contractId,
      disputeResolver: walletAddress,
      distributions: [
        {
          address: address.trim(),
          amount: parsedAmount,
        },
      ],
    });

    if (result) {
      setOpen(false);
      setAddress("");
      setAmount("");
    }
  };

  return (
    <>
      <ActionTrigger
        label="Withdraw Remaining"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Remaining Funds</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="withdraw-address">Recipient</Label>
              <Input
                id="withdraw-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="G…"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="withdraw-amount">Amount</Label>
              <Input
                id="withdraw-amount"
                type="number"
                min={0}
                step="any"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="e.g. 250"
              />
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
            <Button type="button" disabled={loading} onClick={handleSubmit}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
