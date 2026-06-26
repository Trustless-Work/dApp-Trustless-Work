import type { UserResponse } from "@/features/auth/types/auth.types";
import type {
  MemberResponse,
  UpsertMemberInput,
} from "@/features/organizations/types/organization.types";
import {
  getUserDisplayName,
  getUserEmailLabel,
} from "@/helpers/user-display.helper";

export function getUserCommandValue(user: UserResponse): string {
  const email = user.email?.trim();
  return [getUserDisplayName(user), email, user.id].filter(Boolean).join(" ");
}

export function mapUserToMemberInput(user: UserResponse): UpsertMemberInput {
  const email = user.email?.trim();
  return {
    externalId: user.id,
    label: getUserDisplayName(user),
    metadata: email ? { email } : undefined,
  };
}

export function isUserAlreadyMember(
  user: UserResponse,
  members: MemberResponse[],
): boolean {
  return members.some((member) => member.externalId?.trim() === user.id);
}

export function getUserSecondaryLabel(user: UserResponse): string {
  const email = user.email?.trim();
  if (email) {
    return email;
  }
  return getUserEmailLabel(user);
}
