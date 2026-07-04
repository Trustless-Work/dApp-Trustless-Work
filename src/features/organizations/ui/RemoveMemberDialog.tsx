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
import { useArchiveMember } from "@/features/organizations/hooks/useArchiveMember";
import type { MemberResponse } from "@/features/organizations/types/organization.types";

type RemoveMemberDialogProps = {
  organizationId: string;
  member: MemberResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RemoveMemberDialog = ({
  organizationId,
  member,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) => {
  const { mutateAsync, isPending } = useArchiveMember();

  const handleConfirm = async () => {
    if (!member) {
      return;
    }

    await mutateAsync({ organizationId, memberId: member.id });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription>
            {member?.label?.trim()
              ? `"${member.label.trim()}" will be removed from this organization.`
              : "This member will be removed from the organization."}
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
                Removing...
              </>
            ) : (
              "Remove member"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
