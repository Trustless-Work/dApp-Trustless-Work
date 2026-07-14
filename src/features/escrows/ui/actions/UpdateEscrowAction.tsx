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
import { useUpdateEscrowForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { UpdateEscrowFormData } from "@/features/escrows/schemas/escrow-action.schemas";
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
  const form = useUpdateEscrowForm({
    title: escrow.title,
    description: escrow.description,
  });
  const { update, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = form.handleSubmit(
    async (values: UpdateEscrowFormData) => {
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
              title: values.title,
              description: values.description,
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
                symbol:
                  "symbol" in escrow.trustline
                    ? escrow.trustline.symbol
                    : undefined,
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
                title: values.title,
                description: values.description,
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
                  symbol:
                    "symbol" in escrow.trustline
                      ? escrow.trustline.symbol
                      : undefined,
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
    },
  );

  return (
    <>
      <ActionTrigger
        label="Update Escrow"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => {
          form.reset({
            title: escrow.title,
            description: escrow.description,
          });
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Update Escrow Metadata</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="update-title">Title</Label>
                <Input
                  id="update-title"
                  placeholder="Escrow title"
                  {...form.register("title")}
                />
                {form.formState.errors.title ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="update-description">Description</Label>
                <Textarea
                  id="update-description"
                  rows={3}
                  placeholder="Describe the escrow scope and deliverables"
                  {...form.register("description")}
                />
                {form.formState.errors.description ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
