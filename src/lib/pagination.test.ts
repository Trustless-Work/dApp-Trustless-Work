import { describe, expect, it, vi } from "vitest";
import {
  buildKeysetQuery,
  extractListItems,
  fetchAllKeysetPages,
  flattenKeysetPages,
  parseKeysetPage,
} from "@/lib/pagination";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";

describe("extractListItems", () => {
  it("returns arrays as-is", () => {
    expect(extractListItems([1, 2])).toEqual([1, 2]);
  });

  it("extracts data from envelope objects", () => {
    expect(extractListItems({ data: ["a", "b"] })).toEqual(["a", "b"]);
  });

  it("returns an empty array for unsupported shapes", () => {
    expect(extractListItems(null)).toEqual([]);
    expect(extractListItems({ items: [] })).toEqual([]);
  });
});

describe("parseKeysetPage", () => {
  it("wraps raw arrays", () => {
    expect(parseKeysetPage(["x"])).toEqual({
      data: ["x"],
      hasMore: false,
      nextCursor: null,
    });
  });

  it("parses paginated envelopes", () => {
    expect(
      parseKeysetPage({
        data: [{ id: "1" }],
        hasMore: true,
        nextCursor: "cursor-2",
      }),
    ).toEqual({
      data: [{ id: "1" }],
      hasMore: true,
      nextCursor: "cursor-2",
    });
  });

  it("returns an empty page for invalid payloads", () => {
    expect(parseKeysetPage({})).toEqual({
      data: [],
      hasMore: false,
      nextCursor: null,
    });
  });
});

describe("buildKeysetQuery", () => {
  it("builds limit and cursor query strings", () => {
    expect(buildKeysetQuery({ limit: 20, cursor: "abc" })).toBe(
      "?limit=20&cursor=abc",
    );
  });

  it("returns an empty string when no params are provided", () => {
    expect(buildKeysetQuery()).toBe("");
  });
});

describe("fetchAllKeysetPages", () => {
  it("fetches until hasMore is false", async () => {
    const fetchPage = vi
      .fn<(params: KeysetListParams) => Promise<KeysetPage<string>>>()
      .mockResolvedValueOnce({
        data: ["a"],
        hasMore: true,
        nextCursor: "cursor-2",
      })
      .mockResolvedValueOnce({
        data: ["b"],
        hasMore: false,
        nextCursor: null,
      });

    const items = await fetchAllKeysetPages(fetchPage, 1);

    expect(items).toEqual(["a", "b"]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenNthCalledWith(1, { limit: 1, cursor: undefined });
    expect(fetchPage).toHaveBeenNthCalledWith(2, {
      limit: 1,
      cursor: "cursor-2",
    });
  });
});

describe("flattenKeysetPages", () => {
  it("flattens infinite query pages", () => {
    expect(
      flattenKeysetPages({
        pages: [
          { data: ["a"], hasMore: true, nextCursor: "2" },
          { data: ["b"], hasMore: false, nextCursor: null },
        ],
        pageParams: [undefined, "2"],
      }),
    ).toEqual(["a", "b"]);
  });

  it("returns an empty array when pages are undefined", () => {
    expect(flattenKeysetPages(undefined)).toEqual([]);
  });
});
