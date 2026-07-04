export interface KeysetPage<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string | null;
}

export interface KeysetListParams {
  limit?: number;
  cursor?: string;
}

export const DEFAULT_KEYSET_LIMIT = 20;
