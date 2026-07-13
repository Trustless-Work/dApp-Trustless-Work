"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
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
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type {
  EscrowActionProps,
  EscrowMilestoneActionProps,
} from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";

type DistributionRow = {
  address: string;
  amount: string;
};

type ResolveDisputeActionProps = EscrowActionProps | EscrowMilestoneActionProps;

function hasMilestoneIndex(
  props: ResolveDisputeActionProps,
): props is EscrowMilestoneActionProps {
  return "milestoneIndex" in props;
}

export const ResolveDisputeAction = (props: ResolveDisputeActionProps) => {
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
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<DistributionRow[]>([
    { address: "", amount: "" },
  ]);
  const { resolve, loading, walletAddress } = useEscrowActionsContext();

  if (isMulti && milestoneIndex === undefined) {
    return null;
  }

  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }

    const distributions = rows
      .map((row) => ({
        address: row.address.trim(),
        amount: Number(row.amount),
      }))
      .filter(
        (row) => row.address.length > 0 && Number.isFinite(row.amount),
      );

    if (distributions.length === 0) {
      return;
    }

    const result = isMulti
      ? await resolve({
          contractId: escrow.contractId,
          disputeResolver: walletAddress,
          distributions,
          milestoneIndexes: [milestoneIndex ?? 0],
        })
      : await resolve({
          contractId: escrow.contractId,
          disputeResolver: walletAddress,
          distributions,
        });

    if (result) {
      setOpen(false);
      setRows([{ address: "", amount: "" }]);
    }
  };

  return (
    <>
      <ActionTrigger
        label="Resolve Dispute"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_140px_auto]"
              >
                <Input
                  value={row.address}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, address: event.target.value };
                    setRows(next);
                  }}
                  placeholder="Recipient G…"
                />
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={row.amount}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, amount: event.target.value };
                    setRows(next);
                  }}
                  placeholder="Amount"
                />
                {rows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setRows(rows.filter((_, rowIndex) => rowIndex !== index))
                    }
                  >
                    <Trash2Icon />
                  </Button>
                ) : null}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => setRows([...rows, { address: "", amount: "" }])}
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
            <Button type="button" disabled={loading} onClick={handleSubmit}>
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
