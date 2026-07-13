import { describe, expect, it } from "vitest";
import { organizationResponseSchema } from "@/lib/schemas/api-response.schemas";
import { parseKeysetPageWithSchema } from "@/lib/schemas/keyset-page.schema";
import {
  fundEscrowSchema,
  withdrawFundsSchema,
} from "@/features/escrows/schemas/escrow-action.schemas";

describe("parseKeysetPageWithSchema", () => {
  it("parses raw arrays", () => {
    const page = parseKeysetPageWithSchema(organizationResponseSchema, [
      { id: "1", name: "Org" },
    ]);

    expect(page).toEqual({
      data: [{ id: "1", name: "Org" }],
      hasMore: false,
      nextCursor: null,
    });
  });

  it("parses envelopes and drops invalid items via empty fallback", () => {
    const page = parseKeysetPageWithSchema(organizationResponseSchema, {
      data: [{ id: "1", name: "Org" }],
      hasMore: true,
      nextCursor: "abc",
    });

    expect(page.hasMore).toBe(true);
    expect(page.nextCursor).toBe("abc");
    expect(page.data).toHaveLength(1);
  });

  it("returns an empty page for invalid payloads", () => {
    expect(parseKeysetPageWithSchema(organizationResponseSchema, null)).toEqual(
      {
        data: [],
        hasMore: false,
        nextCursor: null,
      },
    );
  });
});

describe("escrow action schemas", () => {
  it("accepts a valid fund amount", () => {
    const result = fundEscrowSchema.safeParse({ amount: "100.5" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(100.5);
    }
  });

  it("rejects invalid withdraw payloads", () => {
    const result = withdrawFundsSchema.safeParse({
      address: "not-a-key",
      amount: "0",
    });
    expect(result.success).toBe(false);
  });
});
