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
import { useUpdateEscrowForm } from "@/features/escrows/hooks/useEscrowActionForms";
import { useEscrowActionsContext } from "@/features/escrows/providers/EscrowActionsProvider";
import type { UpdateEscrowFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { EscrowActionProps } from "@/features/escrows/types/escrow-action.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import { ActionTrigger } from "@/features/escrows/ui/actions/ActionTrigger";
import { UpdateEscrowForm } from "@/features/escrows/ui/actions/UpdateEscrowForm";
import {
  buildUpdateEscrowDefaultValues,
  buildUpdateEscrowPayload,
} from "@/features/escrows/utils/update-escrow-payload.helper";

export const UpdateEscrowAction = ({
  escrow,
  triggerVariant,
  icon,
  triggerMode = "button",
}: EscrowActionProps) => {
  const [open, setOpen] = useState(false);
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const form = useUpdateEscrowForm(escrow);
  const { update, loading, walletAddress } = useEscrowActionsContext();

  const handleSubmit = form.handleSubmit(
    async (values: UpdateEscrowFormData) => {
      if (!walletAddress) {
        return;
      }

      const payload = buildUpdateEscrowPayload(escrow, values);
      const result = await update(payload);

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
          form.reset(buildUpdateEscrowDefaultValues(escrow));
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Update Escrow</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <UpdateEscrowForm form={form} isMulti={isMulti} />
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
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
