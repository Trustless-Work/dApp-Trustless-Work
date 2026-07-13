import { describe, expect, it } from "vitest";
import { createOrganizationSchema } from "@/features/organizations/schemas/create-organization.schema";

describe("createOrganizationSchema", () => {
  it("accepts a valid organization name", () => {
    const result = createOrganizationSchema.safeParse({
      name: "Trustless Labs",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Trustless Labs");
    }
  });

  it("trims whitespace from the name", () => {
    const result = createOrganizationSchema.safeParse({
      name: "  Trustless Labs  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Trustless Labs");
    }
  });

  it("rejects empty and overly long names", () => {
    const empty = createOrganizationSchema.safeParse({ name: "" });
    const tooLong = createOrganizationSchema.safeParse({
      name: "a".repeat(101),
    });

    expect(empty.success).toBe(false);
    expect(tooLong.success).toBe(false);
  });
});
