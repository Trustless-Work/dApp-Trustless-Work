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
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import {
  isStoredMultiReleaseEscrow,
  isStoredSingleReleaseEscrow,
} from "@/features/escrows/types/escrow.types";

export const UpdateEscrowAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(escrow.title);
  const [description, setDescription] = useState(escrow.description);
  const { update, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }

    const admin = escrow.roles.admin;

    const result = isStoredSingleReleaseEscrow(escrow)
      ? await update({
          contractId: escrow.contractId,
          admin,
          escrow: {
            engagementId: escrow.engagementId,
            title: title.trim(),
            description: description.trim(),
            amount: escrow.amount,
            platformFee: escrow.platformFee,
            roles: escrow.roles,
            milestones: escrow.milestones.map((milestone) => ({
              description: milestone.description,
              status: milestone.status,
              approvalsTarget: milestone.approvalsTarget ?? 1,
            })),
            trustline: {
              address: escrow.trustline.address,
              symbol: escrow.trustline.symbol,
              contractId:
                "contractId" in escrow.trustline
                  ? escrow.trustline.contractId
                  : escrow.trustline.address,
            },
          },
        })
      : isStoredMultiReleaseEscrow(escrow)
        ? await update({
            contractId: escrow.contractId,
            admin,
            escrow: {
              engagementId: escrow.engagementId,
              title: title.trim(),
              description: description.trim(),
              platformFee: escrow.platformFee,
              roles: escrow.roles,
              milestones: escrow.milestones.map((milestone) => ({
                description: milestone.description,
                status: milestone.status,
                approvalsTarget: milestone.approvalsTarget ?? 1,
                amount: milestone.amount,
                receiver: milestone.receiver,
              })),
              trustline: {
                address: escrow.trustline.address,
                symbol: escrow.trustline.symbol,
                contractId:
                  "contractId" in escrow.trustline
                    ? escrow.trustline.contractId
                    : escrow.trustline.address,
              },
            },
          })
        : null;

    if (result) {
      setOpen(false);
    }
  };

  return (
    <>
      <ActionTrigger
        label="Update Escrow"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Escrow Metadata</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="update-title">Title</Label>
              <Input
                id="update-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Escrow title"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="update-description">Description</Label>
              <Textarea
                id="update-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="Describe the escrow scope and deliverables"
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
