import { describe, expect, it } from "vitest";
import { profileSchema } from "@/features/settings/schemas/profile.schema";

describe("profileSchema", () => {
  it("accepts valid profile data", () => {
    const result = profileSchema.safeParse({
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("allows an empty email", () => {
    const result = profileSchema.safeParse({
      firstName: "Grace",
      lastName: "Hopper",
      email: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects malformed email values", () => {
    const missingAt = profileSchema.safeParse({
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace.example.com",
    });
    const invalid = profileSchema.safeParse({
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace@",
    });

    expect(missingAt.success).toBe(false);
    expect(invalid.success).toBe(false);
  });
});
