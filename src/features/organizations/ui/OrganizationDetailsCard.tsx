"use client";

import { useState } from "react";
import { CalendarIcon, PencilIcon, ArchiveIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import { formatIsoDateTime } from "@/helpers/format.helper";
import { Separator } from "@/components/ui/separator";
import { ArchiveOrganizationDialog } from "@/features/organizations/ui/ArchiveOrganizationDialog";
import { RenameOrganizationDialog } from "@/features/organizations/ui/RenameOrganizationDialog";

type OrganizationDetailsCardProps = {
  organization: OrganizationResponse;
};

export const OrganizationDetailsCard = ({
  organization,
}: OrganizationDetailsCardProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <>
      <Card className="flex w-full flex-col md:w-1/2">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                Manage this organization&apos;s name or archive it when it is no
                longer needed.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRenameOpen(true)}
              >
                <PencilIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setArchiveOpen(true)}
              >
                <ArchiveIcon />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-auto flex justify-end pt-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>Created</span>
            <Separator orientation="vertical" />
            <span>{formatIsoDateTime(organization.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      <RenameOrganizationDialog
        organization={organization}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <ArchiveOrganizationDialog
        organization={organization}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
      />
    </>
  );
};
