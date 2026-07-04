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
import { useArchiveOrganization } from "@/features/organizations/hooks/useArchiveOrganization";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";

type ArchiveOrganizationDialogProps = {
  organization: OrganizationResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ArchiveOrganizationDialog = ({
  organization,
  open,
  onOpenChange,
}: ArchiveOrganizationDialogProps) => {
  const { mutateAsync, isPending } = useArchiveOrganization();

  const handleConfirm = async () => {
    if (!organization) {
      return;
    }

    await mutateAsync(organization.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive organization?</AlertDialogTitle>
          <AlertDialogDescription>
            {organization
              ? `"${organization.name}" will be hidden from listings. API keys scoped to this organization will be revoked.`
              : "This organization will be hidden from listings."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Archiving...
              </>
            ) : (
              "Archive organization"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
