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

type RevokeApiKeyDialogProps = {
  revokeTarget: string | null;
  isRevoking: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const RevokeApiKeyDialog = ({
  revokeTarget,
  isRevoking,
  onOpenChange,
  onConfirm,
}: RevokeApiKeyDialogProps) => (
  <AlertDialog open={revokeTarget !== null} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
        <AlertDialogDescription>
          This key will be revoked immediately. Any integrations using it will
          stop working.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          disabled={isRevoking}
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isRevoking ? (
            <>
              <Loader2 className="animate-spin" />
              Revoking...
            </>
          ) : (
            "Revoke key"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
