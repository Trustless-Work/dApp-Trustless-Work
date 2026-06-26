"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserResponse } from "@/features/auth/types/auth.types";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from "@/helpers/user-display.helper";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  user: UserResponse;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export const UserAvatar = ({
  user,
  size = "default",
  className,
}: UserAvatarProps) => {
  const imageUrl = getUserAvatarUrl(user);
  const displayName = getUserDisplayName(user);

  return (
    <Avatar size={size} className={cn("rounded-lg", className)}>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={displayName} className="rounded-lg" />
      ) : null}
      <AvatarFallback className="rounded-lg text-xs font-medium">
        {getUserInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
};
