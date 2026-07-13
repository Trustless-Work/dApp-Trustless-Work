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
import type { UserResponse } from "@/types";
import {
  getUserDisplayName,
  getUserEmailLabel,
} from "@/helpers/user-display.helper";
import { formatIsoDateTime } from "@/helpers/format.helper";
import { Separator } from "@/components/ui/separator";

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
      <CardContent>
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" className="size-16 rounded-xl" />
          <div className="min-w-0 space-y-1">
            <p className="truncate text-lg font-semibold">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {emailLabel}
            </p>
          </div>
        </div>
      </CardContent>
      <CardContent className="mt-auto flex justify-end pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Member Since</span>
          <Separator orientation="vertical" />
          <span className="text-foreground">
            {formatIsoDateTime(user.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
