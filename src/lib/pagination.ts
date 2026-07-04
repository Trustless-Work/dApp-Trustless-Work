import type { InfiniteData } from "@tanstack/react-query";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";

function isKeysetEnvelope<T>(value: unknown): value is KeysetPage<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as KeysetPage<T>).data) &&
    "hasMore" in value &&
    typeof (value as KeysetPage<T>).hasMore === "boolean"
  );
}

export function parseKeysetPage<T>(data: unknown): KeysetPage<T> {
  if (Array.isArray(data)) {
    return {
      data: data as T[],
      hasMore: false,
      nextCursor: null,
    };
  }

  if (isKeysetEnvelope<T>(data)) {
    return {
      data: data.data,
      hasMore: data.hasMore,
      nextCursor: data.nextCursor ?? null,
    };
  }

  return {
    data: [],
    hasMore: false,
    nextCursor: null,
  };
}

export function buildKeysetQuery(params: KeysetListParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchAllKeysetPages<T>(
  fetchPage: (params: KeysetListParams) => Promise<KeysetPage<T>>,
  limit = 100,
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | undefined;

  do {
    const page = await fetchPage({ limit, cursor });
    items.push(...page.data);
    cursor = page.hasMore ? (page.nextCursor ?? undefined) : undefined;
  } while (cursor);

  return items;
}

export function flattenKeysetPages<T>(
  pages: InfiniteData<KeysetPage<T>> | undefined,
): T[] {
  if (!pages) {
    return [];
  }

  return pages.pages.flatMap((page) => page.data);
}
