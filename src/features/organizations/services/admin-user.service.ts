import http from "@/lib/http";
import {
  buildKeysetQuery,
  fetchAllKeysetPages,
  parseKeysetPage,
} from "@/lib/pagination";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";
import type { UserResponse } from "@/features/auth/types/auth.types";

export class AdminUserService {
  async listPage(
    params: KeysetListParams = {},
  ): Promise<KeysetPage<UserResponse>> {
    const { data } = await http.get<unknown>(
      `/admin/users${buildKeysetQuery(params)}`,
    );
    return parseKeysetPage<UserResponse>(data);
  }

  async listAll(): Promise<UserResponse[]> {
    return fetchAllKeysetPages((params) => this.listPage(params));
  }
}

export const adminUserService = new AdminUserService();
