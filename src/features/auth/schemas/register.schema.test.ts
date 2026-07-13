import { describe, expect, it } from "vitest";
import { registerSchema } from "@/features/auth/schemas/register.schema";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("trims whitespace from names and email", () => {
    const result = registerSchema.safeParse({
      firstName: "  Ada  ",
      lastName: "  Lovelace  ",
      email: "  ada@example.com  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Ada");
      expect(result.data.lastName).toBe("Lovelace");
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects missing first name and invalid email", () => {
    const missingFirstName = registerSchema.safeParse({
      firstName: "",
      lastName: "Lovelace",
      email: "ada@example.com",
    });
    const invalidEmail = registerSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "not-an-email",
    });

    expect(missingFirstName.success).toBe(false);
    expect(invalidEmail.success).toBe(false);
  });
});
