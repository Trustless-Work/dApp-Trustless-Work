import http from "@/lib/http";
import type { UserResponse } from "@/types";
import type { UpdateProfileInput } from "@/features/settings/schemas/profile.schema";

export class ProfileService {
  async updateProfile(payload: UpdateProfileInput): Promise<UserResponse> {
    const { data } = await http.patch<UserResponse>(
      "/users/me/profile",
      payload,
    );
    return data;
  }
}

export const profileService = new ProfileService();
