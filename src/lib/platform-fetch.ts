import type { ProblemDetails } from "@/lib/api-error";

function getCoreApiUrl(): string {
  const url = process.env.CORE_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("CORE_API_URL is not configured");
  }
  return url.replace(/\/$/, "");
}

function getPlatformApiKey(): string | undefined {
  return (
    process.env.BACKOFFICE_ADMIN_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY
  );
}

export function createPlatformCredentialMissingResponse(): Response {
  const body: ProblemDetails = {
    status: 503,
    code: "PLATFORM_CREDENTIAL_MISSING",
    title: "Service Unavailable",
    detail: "Backoffice operator API key is not configured on the server",
  };
  return Response.json(body, { status: 503 });
}

export async function platformFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const apiKey = getPlatformApiKey();
  if (!apiKey) {
    return createPlatformCredentialMissingResponse();
  }

  const url = `${getCoreApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("x-api-key", apiKey);

  return fetch(url, {
    ...init,
    headers,
  });
}
