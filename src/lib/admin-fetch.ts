import { serverEnv } from "@/lib/env";
import type { ProblemDetails } from "@/lib/api-error";

export function createAdminCredentialMissingResponse(): Response {
  const body: ProblemDetails = {
    status: 503,
    code: "PLATFORM_CREDENTIAL_MISSING",
    title: "Service Unavailable",
    detail: "Backoffice operator API key is not configured on the server",
  };
  return Response.json(body, { status: 503 });
}

export async function adminFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const apiKey = serverEnv.api.adminApiKey;
  if (!apiKey) {
    return createAdminCredentialMissingResponse();
  }

  const url = `${serverEnv.api.coreApiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("x-api-key", apiKey);

  return fetch(url, {
    ...init,
    headers,
  });
}
