"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatAddress } from "@/helpers/format.helper";
import { cn } from "@/lib/utils";

type UnlinkWalletDialogProps = {
  unlinkTarget: string | null;
  isUnlinking: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const UnlinkWalletDialog = ({
  unlinkTarget,
  isUnlinking,
  onOpenChange,
  onConfirm,
}: UnlinkWalletDialogProps) => (
  <AlertDialog open={unlinkTarget !== null} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Unlink wallet?</AlertDialogTitle>
        <AlertDialogDescription>
          {unlinkTarget
            ? `This will remove ${formatAddress(unlinkTarget, 8)} from your account. You can link it again later with a new verification.`
            : null}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isUnlinking}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(
            "bg-destructive text-white hover:bg-destructive/90",
          )}
          disabled={isUnlinking}
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isUnlinking ? (
            <>
              <Loader2 className="animate-spin" />
              Unlinking...
            </>
          ) : (
            "Unlink wallet"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
