import http from "@/lib/http";
import {
  buildKeysetQuery,
  fetchAllKeysetPages,
} from "@/lib/pagination";
import { userResponseSchema } from "@/lib/schemas/api-response.schemas";
import { parseKeysetPageWithSchema } from "@/lib/schemas/keyset-page.schema";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";
import type { UserResponse } from "@/types";

export class AdminUserService {
  async listPage(
    params: KeysetListParams = {},
  ): Promise<KeysetPage<UserResponse>> {
    const { data } = await http.get<unknown>(
      `/admin/users${buildKeysetQuery(params)}`,
    );
    return parseKeysetPageWithSchema(userResponseSchema, data);
  }

  async listAll(): Promise<UserResponse[]> {
    return fetchAllKeysetPages((params) => this.listPage(params));
  }
}

export const adminUserService = new AdminUserService();
