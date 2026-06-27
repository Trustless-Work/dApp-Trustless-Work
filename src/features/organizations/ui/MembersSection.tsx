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
import {
  MembersTable,
  MembersTableSkeleton,
} from "@/features/organizations/ui/MembersTable";
import { useOrganizationMembersDisplay } from "@/features/organizations/hooks/useOrganizationMembers";
import { parseApiError } from "@/lib/api-error";

type MembersSectionProps = {
  organizationId: string;
};

export const MembersSection = ({ organizationId }: MembersSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { members, isLoading, isError, error, refetch } =
    useOrganizationMembersDisplay(organizationId);
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
            <MembersTable members={members} />
          ) : null}
        </CardContent>
      </Card>

      <AddMemberDialog
        organizationId={organizationId}
        existingMembers={members}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
