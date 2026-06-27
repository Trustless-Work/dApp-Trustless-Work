import type { UserResponse } from "@/features/auth/types/auth.types";

export function getUserDisplayName(user: UserResponse): string {
  const parts = [user.firstName, user.lastName].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return "Trustless Work user";
}

export function getUserInitials(user: UserResponse): string {
  const first = user.firstName?.trim().charAt(0) ?? "";
  const last = user.lastName?.trim().charAt(0) ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return "TW";
}

export function getUserEmailLabel(user: UserResponse): string {
  const email = user.email?.trim();
  return email || "No email on file";
}

type UserWithOptionalAvatarFields = UserResponse & {
  avatarUrl?: string | null;
  profileImage?: string | null;
};

export function getUserAvatarUrl(user: UserResponse): string | undefined {
  const extended = user as UserWithOptionalAvatarFields;
  const candidates = [
    extended.profileImageUrl,
    extended.avatarUrl,
    extended.profileImage,
  ];

  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}
