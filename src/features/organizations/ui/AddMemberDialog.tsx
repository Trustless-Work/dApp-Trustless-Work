"use client";

import { Loader2, UsersIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSearchCombobox } from "@/features/organizations/ui/UserSearchCombobox";
import { useAdminUsers } from "@/features/organizations/hooks/useAdminUsers";
import { useUpsertMember } from "@/features/organizations/hooks/useUpsertMember";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import {
  isUserAlreadyMember,
  mapUserToMemberInput,
} from "@/features/organizations/helpers/member-from-user.helper";
import { parseApiError } from "@/lib/api-error";
import { useAuth } from "@/providers/AuthProvider";

type AddMemberDialogProps = {
  organizationId: string;
  existingMembers: MemberResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddMemberDialogSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const AddMemberDialog = ({
  organizationId,
  existingMembers,
  open,
  onOpenChange,
}: AddMemberDialogProps) => {
  const { user: currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useAdminUsers(open);
  const { mutateAsync, isPending } = useUpsertMember();

  useEffect(() => {
    if (!open) {
      setSelectedUserId(null);
    }
  }, [open]);

  const availableUsers = useMemo(() => {
    const allUsers = users ?? [];
    return allUsers.filter((user) => {
      if (currentUser?.id === user.id) {
        return false;
      }

      return !isUserAlreadyMember(user, existingMembers);
    });
  }, [currentUser, existingMembers, users]);

  const usersErrorDetail = isUsersError
    ? parseApiError(usersError).detail
    : null;

  const handleAddMember = async () => {
    const selectedUser = availableUsers.find(
      (user) => user.id === selectedUserId,
    );
    if (!selectedUser) {
      return;
    }

    await mutateAsync({
      organizationId,
      payload: mapUserToMemberInput(selectedUser),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Search and select a Trustless Work user to add to this organization.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {isLoadingUsers ? <AddMemberDialogSkeleton /> : null}

          {!isLoadingUsers && usersErrorDetail ? (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{usersErrorDetail}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  void refetchUsers();
                }}
              >
                Try again
              </Button>
            </div>
          ) : null}

          {!isLoadingUsers &&
          !usersErrorDetail &&
          availableUsers.length === 0 ? (
            <NoData
              icon={UsersIcon}
              title="No users available to add"
              description="All users are already members of this organization."
            />
          ) : null}

          {!isLoadingUsers && !usersErrorDetail && availableUsers.length > 0 ? (
            <UserSearchCombobox
              users={availableUsers}
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isPending}
              placeholder="Select a user..."
            />
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              void handleAddMember();
            }}
            disabled={
              isPending ||
              !selectedUserId ||
              isLoadingUsers ||
              availableUsers.length === 0
            }
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Adding...
              </>
            ) : (
              "Add member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
