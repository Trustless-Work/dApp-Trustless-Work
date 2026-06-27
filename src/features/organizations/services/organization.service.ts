import http from "@/lib/http";
import type {
  CreateOrganizationInput,
  MemberResponse,
  OrganizationResponse,
  UpsertMemberInput,
} from "@/features/organizations/types/organization.types";

export class OrganizationService {
  async listMine(): Promise<OrganizationResponse[]> {
    const { data } = await http.get<OrganizationResponse[]>(
      "/core/users/me/platforms",
    );
    return data;
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

  async listMembers(organizationId: string): Promise<MemberResponse[]> {
    const { data } = await http.get<MemberResponse[]>(
      `/core/platforms/${organizationId}/subjects`,
    );
    return data;
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
}

export const organizationService = new OrganizationService();
