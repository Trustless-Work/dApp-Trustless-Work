import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import {
  ORGANIZATIONS_QUERY_KEY,
  organizationMembersQueryKey,
} from "@/features/organizations/hooks/useOrganizations";
import type {
  MemberResponse,
  OrganizationResponse,
} from "@/features/organizations/types/organization.types";
import type { KeysetPage } from "@/types/pagination.entity";

type OrganizationsCache = InfiniteData<KeysetPage<OrganizationResponse>>;
type MembersCache = InfiniteData<KeysetPage<MemberResponse>>;

function createSinglePageCache<T>(item: T): InfiniteData<KeysetPage<T>> {
  return {
    pages: [
      {
        data: [item],
        hasMore: false,
        nextCursor: null,
      },
    ],
    pageParams: [undefined],
  };
}

export function prependOrganizationToCache(
  queryClient: QueryClient,
  organization: OrganizationResponse,
): void {
  queryClient.setQueriesData<OrganizationsCache>(
    { queryKey: ORGANIZATIONS_QUERY_KEY },
    (current) => {
      if (!current) {
        return createSinglePageCache(organization);
      }

      const alreadyExists = current.pages.some((page) =>
        page.data.some((org) => org.id === organization.id),
      );

      if (alreadyExists) {
        return current;
      }

      const [firstPage, ...restPages] = current.pages;

      if (!firstPage) {
        return createSinglePageCache(organization);
      }

      return {
        ...current,
        pages: [
          {
            ...firstPage,
            data: [...firstPage.data, organization],
          },
          ...restPages,
        ],
      };
    },
  );
}

export function setInitialMembersCache(
  queryClient: QueryClient,
  organizationId: string,
  member: MemberResponse,
): void {
  queryClient.setQueryData<MembersCache>(
    organizationMembersQueryKey(organizationId),
    createSinglePageCache(member),
  );
}
