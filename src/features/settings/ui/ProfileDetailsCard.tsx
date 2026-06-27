"use client";

import { CalendarIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { UserResponse } from "@/features/auth/types/auth.types";
import {
  getUserDisplayName,
  getUserEmailLabel,
} from "@/helpers/user-display.helper";
import { formatIsoDateTime } from "@/helpers/format.helper";
import { Separator } from "@/components/ui/separator";

type ProfileFieldProps = {
  label: string;
  value: string;
};

const ProfileField = ({ label, value }: ProfileFieldProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

type ProfileDetailsCardProps = {
  user: UserResponse;
  onEdit: () => void;
};

export const ProfileDetailsCard = ({
  user,
  onEdit,
}: ProfileDetailsCardProps) => {
  const displayName = getUserDisplayName(user);
  const emailLabel = getUserEmailLabel(user);

  return (
    <Card className="flex w-full flex-col md:w-1/2">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your account details and contact information.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" className="size-16 rounded-xl" />
          <div className="min-w-0 space-y-1">
            <p className="truncate text-lg font-semibold">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {emailLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileField
            label="First name"
            value={user.firstName?.trim() || "-"}
          />
          <ProfileField
            label="Last name"
            value={user.lastName?.trim() || "-"}
          />
          <ProfileField label="Email" value={emailLabel} />
        </div>

        <div className="mt-auto flex justify-end pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>Member since</span>
            <Separator orientation="vertical" className="h-3" />
            <span className="text-foreground">
              {formatIsoDateTime(user.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
