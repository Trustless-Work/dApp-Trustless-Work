import type { AxiosError } from "axios";

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  code?: string;
  detail?: string;
  instance?: string;
  traceId?: string;
  extensions?: Record<string, unknown>;
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  detail: string;
  traceId?: string;
  extensions?: Record<string, unknown>;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    "status" in error &&
    "detail" in error &&
    typeof (error as ApiError).status === "number"
  );
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    ("detail" in value || "code" in value || "status" in value)
  );
}

export function parseApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<ProblemDetails>;
    const data = axiosError.response?.data;
    const status = axiosError.response?.status ?? 500;

    if (isProblemDetails(data)) {
      const apiError = new Error(
        data.detail ?? data.title ?? "Request failed",
      ) as ApiError;
      apiError.status = status;
      apiError.code = data.code;
      apiError.detail = data.detail ?? data.title ?? "Request failed";
      apiError.traceId = data.traceId;
      apiError.extensions = data.extensions;
      return apiError;
    }

    const apiError = new Error(axiosError.message) as ApiError;
    apiError.status = status;
    apiError.detail = axiosError.message;
    return apiError;
  }

  const apiError = new Error("Unknown error") as ApiError;
  apiError.status = 500;
  apiError.detail = "Unknown error";
  return apiError;
}

const REGISTRATION_REQUIRED_CODES = new Set([
  "SESSION_WALLET_NOT_REGISTERED",
  "NOT_FOUND",
  "USER_NOT_FOUND",
]);

export function isRegistrationRequiredError(error: unknown): boolean {
  const parsed = parseApiError(error);
  if (parsed.status === 404) {
    return true;
  }

  const code = parsed.code?.toUpperCase();
  return code !== undefined && REGISTRATION_REQUIRED_CODES.has(code);
}

export function isNotFoundError(error: unknown): boolean {
  return isRegistrationRequiredError(error);
}

export function isUnauthorizedError(error: unknown): boolean {
  return parseApiError(error).status === 401;
}
