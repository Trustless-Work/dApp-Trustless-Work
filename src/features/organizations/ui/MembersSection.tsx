"use client";

import { PlusIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddMemberDialog } from "@/features/organizations/ui/AddMemberDialog";
import { EditMemberDialog } from "@/features/organizations/ui/EditMemberDialog";
import { RemoveMemberDialog } from "@/features/organizations/ui/RemoveMemberDialog";
import {
  MembersTable,
  MembersTableSkeleton,
} from "@/features/organizations/ui/MembersTable";
import { useOrganizationMembersDisplay } from "@/features/organizations/hooks/useOrganizationMembers";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { parseApiError } from "@/lib/api-error";

type MembersSectionProps = {
  organizationId: string;
};

export const MembersSection = ({ organizationId }: MembersSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MemberResponse | null>(null);
  const [removeTarget, setRemoveTarget] = useState<MemberResponse | null>(null);
  const {
    members,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useOrganizationMembersDisplay(organizationId);
  const errorDetail = isError ? parseApiError(error).detail : null;

  return (
    <>
      <Card className="w-full md:w-1/2">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Users in this organization. Add members from the global user
              directory.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => setDialogOpen(true)}
            disabled={isLoading}
          >
            <PlusIcon />
            Add member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <MembersTableSkeleton /> : null}

          {!isLoading && errorDetail ? (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{errorDetail}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  void refetch();
                }}
              >
                Try again
              </Button>
            </div>
          ) : null}

          {!isLoading && !errorDetail && members.length === 0 ? (
            <NoData
              icon={UserIcon}
              title="No members yet"
              description="Add a user from the directory to get started."
              actionLabel="Add member"
              onAction={() => setDialogOpen(true)}
            />
          ) : null}

          {!isLoading && !errorDetail && members.length > 0 ? (
            <div className="flex flex-col gap-4">
              <MembersTable
                members={members}
                onEdit={setEditTarget}
                onRemove={setRemoveTarget}
              />
              {hasNextPage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  disabled={isFetchingNextPage}
                  onClick={() => {
                    void fetchNextPage();
                  }}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <AddMemberDialog
        organizationId={organizationId}
        existingMembers={members}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <EditMemberDialog
        organizationId={organizationId}
        member={editTarget}
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditTarget(null);
          }
        }}
      />
      <RemoveMemberDialog
        organizationId={organizationId}
        member={removeTarget}
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null);
          }
        }}
      />
    </>
  );
};
