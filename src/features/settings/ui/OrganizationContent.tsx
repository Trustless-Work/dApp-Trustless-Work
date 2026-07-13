"use client";

import { Building2Icon } from "lucide-react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationDetailsCard } from "@/features/organizations/ui/OrganizationDetailsCard";
import { MembersSection } from "@/features/organizations/ui/MembersSection";
import { MembersTableSkeleton } from "@/features/organizations/ui/MembersTable";
import { useActiveOrganization } from "@/providers/OrganizationProvider";

const OrganizationContentSkeleton = () => (
  <div className="flex flex-col gap-6 md:flex-row">
    <Card className="flex w-full flex-col md:w-1/2">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex justify-end pt-0">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 shrink-0 rounded-sm" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      </CardContent>
    </Card>
    <Card className="w-full md:w-1/2">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        <Skeleton className="h-8 w-28" />
      </CardHeader>
      <CardContent>
        <MembersTableSkeleton />
      </CardContent>
    </Card>
  </div>
);

export const OrganizationContent = () => {
  const {
    activeOrganization,
    activeOrganizationId,
    isLoading,
    isError,
    refetch,
  } = useActiveOrganization();

  if (isLoading) {
    return <OrganizationContentSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load organizations</CardTitle>
          <CardDescription>
            We could not fetch your organizations. Try again in a moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              refetch();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!activeOrganization || !activeOrganizationId) {
    return (
      <NoData
        icon={Building2Icon}
        title="No organization selected"
        description="Create an organization from the sidebar switcher to manage members and scoped resources."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <OrganizationDetailsCard organization={activeOrganization} />
      <MembersSection organizationId={activeOrganizationId} />
    </div>
  );
};
