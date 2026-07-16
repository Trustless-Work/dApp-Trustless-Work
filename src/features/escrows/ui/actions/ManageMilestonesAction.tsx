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
import { Form } from "@/components/ui/form";
import { useManageMilestonesForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionPolicy } from "@/features/escrows/hooks/useEscrowActionPolicy";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { ManageMilestonesFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { ManageMilestonesForm } from "@/features/escrows/ui/actions/ManageMilestonesForm";
import {
  buildManageMilestonesDefaultValues,
  buildManageMilestonesPayload,
  getEscrowApproversCount,
  hasManageMilestonesChanges,
} from "@/features/escrows/utils/manage-milestones.helper";

export const ManageMilestonesAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const policy = useEscrowActionPolicy(escrow);
  const canEditExisting = policy.canEditExistingMilestones();
  const approversCount = getEscrowApproversCount(escrow);
  const [open, setOpen] = useState(false);
  const { manageMilestones, loading, walletAddress } = useEscrowActionsContext();

  const form = useManageMilestonesForm({
    isMulti,
    approversCount,
    existingCount: escrow.milestones.length,
    defaultValues: buildManageMilestonesDefaultValues(escrow),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildManageMilestonesDefaultValues(escrow));
    }
  };

  const handleSubmit = form.handleSubmit(
    async (values: ManageMilestonesFormData) => {
      if (!walletAddress) {
        return;
      }

      if (!hasManageMilestonesChanges(escrow, values, canEditExisting)) {
        return;
      }

      const payload = buildManageMilestonesPayload(
        escrow,
        walletAddress,
        values,
        canEditExisting,
      );

      const result = await manageMilestones(payload);

      if (result) {
        setOpen(false);
        form.reset(buildManageMilestonesDefaultValues(escrow));
      }
    },
  );

  return (
    <>
      <ActionTrigger
        label="Manage Milestones"
        triggerMode={triggerMode}
        triggerVariant={triggerVariant}
        icon={icon}
        onActivate={() => handleOpenChange(true)}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Manage Milestones</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <ManageMilestonesForm
                  form={form}
                  escrow={escrow}
                  isMulti={isMulti}
                  canEditExisting={canEditExisting}
                  approversCount={approversCount}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Save milestones
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
