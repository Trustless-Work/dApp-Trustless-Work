import { getSessionToken } from "@/lib/session";
import { serverEnv } from "@/lib/env";
import type { ProblemDetails } from "@/lib/api-error";

export function createUnauthorizedResponse(): Response {
  const body: ProblemDetails = {
    status: 401,
    code: "AUTH_CREDENTIAL_MISSING",
    title: "Unauthorized",
    detail: "No active session. Please sign in again.",
  };
  return Response.json(body, { status: 401 });
}

export async function coreFetch(
  path: string,
  init?: RequestInit,
  bearer?: string,
): Promise<Response> {
  const token = bearer ?? (await getSessionToken());
  if (!token) {
    return createUnauthorizedResponse();
  }

  const url = `${serverEnv.api.coreApiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, {
    ...init,
    headers,
  });
}
