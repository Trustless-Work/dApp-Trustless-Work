"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CreateEscrowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateEscrowDialog = ({
  open,
  onOpenChange,
}: CreateEscrowDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create escrow</DialogTitle>
          <DialogDescription>
            Deploy a new escrow contract to manage payments, milestones, and
            releases on Stellar.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
