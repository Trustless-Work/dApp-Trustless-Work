import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import {
  isApiError,
  isNotFoundError,
  isProblemDetails,
  isRegistrationRequiredError,
  isUnauthorizedError,
  parseApiError,
  type ApiError,
} from "@/lib/api-error";

describe("parseApiError", () => {
  it("returns the same ApiError when input is already ApiError", () => {
    const error = new Error("Already parsed") as ApiError;
    error.status = 422;
    error.detail = "Already parsed";
    error.code = "VALIDATION_ERROR";

    const result = parseApiError(error);

    expect(result).toBe(error);
    expect(result.status).toBe(422);
    expect(result.code).toBe("VALIDATION_ERROR");
  });

  it("parses Axios errors with ProblemDetails body", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: {} } as never,
        data: {
          status: 400,
          code: "BAD_REQUEST",
          detail: "Invalid payload",
          traceId: "trace-123",
        },
      },
    );

    const result = parseApiError(axiosError);

    expect(result.status).toBe(400);
    expect(result.code).toBe("BAD_REQUEST");
    expect(result.detail).toBe("Invalid payload");
    expect(result.traceId).toBe("trace-123");
  });

  it("parses Axios errors without ProblemDetails body", () => {
    const axiosError = new AxiosError(
      "Network Error",
      "ERR_NETWORK",
      undefined,
      undefined,
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {},
        config: { headers: {} } as never,
        data: "upstream unavailable",
      },
    );

    const result = parseApiError(axiosError);

    expect(result.status).toBe(503);
    expect(result.detail).toBe("Network Error");
  });

  it("returns a generic 500 error for unknown input", () => {
    const result = parseApiError("unexpected");

    expect(result.status).toBe(500);
    expect(result.detail).toBe("Unknown error");
  });
});

describe("isProblemDetails", () => {
  it("returns true for objects with detail, code, or status", () => {
    expect(isProblemDetails({ detail: "oops" })).toBe(true);
    expect(isProblemDetails({ code: "ERR" })).toBe(true);
    expect(isProblemDetails({ status: 404 })).toBe(true);
  });

  it("returns false for non-objects", () => {
    expect(isProblemDetails(null)).toBe(false);
    expect(isProblemDetails("error")).toBe(false);
    expect(isProblemDetails({})).toBe(false);
  });
});

describe("isApiError", () => {
  it("narrows errors with status and detail", () => {
    const error = new Error("fail") as ApiError;
    error.status = 500;
    error.detail = "fail";

    expect(isApiError(error)).toBe(true);
    expect(isApiError(new Error("plain"))).toBe(false);
  });
});

describe("registration and auth error helpers", () => {
  it("detects registration-required errors by status or code", () => {
    const notFound = new Error("missing") as ApiError;
    notFound.status = 404;
    notFound.detail = "missing";

    const sessionCode = new Error("wallet") as ApiError;
    sessionCode.status = 400;
    sessionCode.detail = "wallet";
    sessionCode.code = "SESSION_WALLET_NOT_REGISTERED";

    expect(isRegistrationRequiredError(notFound)).toBe(true);
    expect(isNotFoundError(notFound)).toBe(true);
    expect(isRegistrationRequiredError(sessionCode)).toBe(true);
    expect(isRegistrationRequiredError(new Error("other"))).toBe(false);
  });

  it("detects unauthorized errors", () => {
    const unauthorized = new Error("unauthorized") as ApiError;
    unauthorized.status = 401;
    unauthorized.detail = "unauthorized";

    expect(isUnauthorizedError(unauthorized)).toBe(true);
    expect(isUnauthorizedError(new Error("other"))).toBe(false);
  });
});
