import http from "@/lib/http";
import type { UserResponse } from "@/features/auth/types/auth.types";

export class AdminUserService {
  async listAll(): Promise<UserResponse[]> {
    const { data } = await http.get<UserResponse[]>("/admin/users");
    return data;
  }
}

export const adminUserService = new AdminUserService();
