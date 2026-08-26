import { describe, expect, it } from "vitest";
import {
  DEFAULT_ANALYTICS_MONTHS,
  parseMonthsParam,
} from "@/lib/admin-session-response";

describe("parseMonthsParam", () => {
  it("returns the default when the param is missing", () => {
    const result = parseMonthsParam(null);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(DEFAULT_ANALYTICS_MONTHS);
    }
  });

  it("returns the default when the param is blank", () => {
    const result = parseMonthsParam("   ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(DEFAULT_ANALYTICS_MONTHS);
    }
  });

  it("accepts valid integers in range", () => {
    const result = parseMonthsParam("24");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(24);
    }
  });

  it("rejects values below the minimum", () => {
    const result = parseMonthsParam("0");
    expect(result.ok).toBe(false);
  });

  it("rejects values above the maximum", () => {
    const result = parseMonthsParam("37");
    expect(result.ok).toBe(false);
  });

  it("rejects non-numeric values", () => {
    const result = parseMonthsParam("abc");
    expect(result.ok).toBe(false);
  });

  it("rejects fractional values", () => {
    const result = parseMonthsParam("12.5");
    expect(result.ok).toBe(false);
  });
});
