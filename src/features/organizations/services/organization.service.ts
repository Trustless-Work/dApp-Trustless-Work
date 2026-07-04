import http from "@/lib/http";
import {
  buildKeysetQuery,
  fetchAllKeysetPages,
  parseKeysetPage,
} from "@/lib/pagination";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";
import type {
  CreateOrganizationInput,
  MemberResponse,
  OrganizationResponse,
  UpdateMemberInput,
  UpdateOrganizationInput,
  UpsertMemberInput,
} from "@/features/organizations/types/organization.types";

export class OrganizationService {
  async listMinePage(
    params: KeysetListParams = {},
  ): Promise<KeysetPage<OrganizationResponse>> {
    const { data } = await http.get<unknown>(
      `/core/users/me/platforms${buildKeysetQuery(params)}`,
    );
    return parseKeysetPage<OrganizationResponse>(data);
  }

  async listMine(): Promise<OrganizationResponse[]> {
    return fetchAllKeysetPages((params) => this.listMinePage(params));
  }

  async create(
    payload: CreateOrganizationInput,
  ): Promise<OrganizationResponse> {
    const { data } = await http.post<OrganizationResponse>(
      "/core/platforms",
      payload,
    );
    return data;
  }

  async update(
    id: string,
    payload: UpdateOrganizationInput,
  ): Promise<OrganizationResponse> {
    const { data } = await http.patch<OrganizationResponse>(
      `/core/platforms/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  }

  async archive(id: string): Promise<void> {
    await http.delete(`/core/platforms/${encodeURIComponent(id)}`);
  }

  async listMembersPage(
    organizationId: string,
    params: KeysetListParams = {},
  ): Promise<KeysetPage<MemberResponse>> {
    const { data } = await http.get<unknown>(
      `/core/platforms/${encodeURIComponent(organizationId)}/subjects${buildKeysetQuery(params)}`,
    );
    return parseKeysetPage<MemberResponse>(data);
  }

  async listMembers(organizationId: string): Promise<MemberResponse[]> {
    return fetchAllKeysetPages((params) =>
      this.listMembersPage(organizationId, params),
    );
  }

  async upsertMember(
    organizationId: string,
    payload: UpsertMemberInput,
  ): Promise<MemberResponse> {
    const { data } = await http.post<MemberResponse>(
      `/core/platforms/${organizationId}/subjects`,
      payload,
    );
    return data;
  }

  async updateMember(
    organizationId: string,
    memberId: string,
    payload: UpdateMemberInput,
  ): Promise<MemberResponse> {
    const { data } = await http.patch<MemberResponse>(
      `/core/platforms/${encodeURIComponent(organizationId)}/subjects/${encodeURIComponent(memberId)}`,
      payload,
    );
    return data;
  }

  async archiveMember(organizationId: string, memberId: string): Promise<void> {
    await http.delete(
      `/core/platforms/${encodeURIComponent(organizationId)}/subjects/${encodeURIComponent(memberId)}`,
    );
  }
}

export const organizationService = new OrganizationService();
