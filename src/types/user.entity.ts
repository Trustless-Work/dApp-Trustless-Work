import type { NullableField, EntityId } from "@/types/primitives";
import type {
  WithAccountRoles,
  WithEntityTimestamps,
} from "@/types/roles";

export interface UserProfileFields {
  firstName: string;
  lastName?: string;
  email?: string;
}

export interface UserResponse extends WithAccountRoles, WithEntityTimestamps {
  id: EntityId;
  email?: NullableField<string>;
  firstName?: NullableField<string>;
  lastName?: NullableField<string>;
  profileImageUrl?: NullableField<string>;
  isActive: boolean;
  emailVerified?: boolean;
}
