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

type DeleteApiKeyDialogProps = {
  deleteTarget: string | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const DeleteApiKeyDialog = ({
  deleteTarget,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteApiKeyDialogProps) => (
  <AlertDialog open={deleteTarget !== null} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete API key?</AlertDialogTitle>
        <AlertDialogDescription>
          This key will be permanently removed. Any integrations using it will
          stop working immediately.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          disabled={isDeleting}
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isDeleting ? (
            <>
              <Loader2 className="animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete key"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
