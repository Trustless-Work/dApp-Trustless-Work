"use client";

import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import { formatIsoDateTime } from "@/helpers/format.helper";
import { Separator } from "@/components/ui/separator";

type OrganizationDetailsCardProps = {
  organization: OrganizationResponse;
};

export const OrganizationDetailsCard = ({
  organization,
}: OrganizationDetailsCardProps) => {
  return (
    <Card className="flex w-full flex-col md:w-1/2">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>
          Active organization details. Names cannot be changed from the
          backoffice yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex justify-end pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Created</span>

          <Separator orientation="vertical" />

          <span className="text-foreground-foreground">
            {formatIsoDateTime(organization.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
