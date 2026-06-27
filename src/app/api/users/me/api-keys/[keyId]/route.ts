import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-fetch";
import { coreFetch } from "@/lib/core-fetch";
import { proxyCoreResponse, validateSameOrigin } from "@/lib/bff-utils";
import type { ProblemDetails } from "@/lib/api-error";
import type { ApiKeyResponse } from "@/features/api-keys/types/api-key.types";
import type { UserResponse } from "@/features/auth/types/auth.types";

type RouteContext = {
  params: Promise<{ keyId: string }>;
};

function notFoundResponse(keyId: string): NextResponse {
  const body: ProblemDetails = {
    status: 404,
    code: "NOT_FOUND",
    title: "Not Found",
    detail: `API key "${keyId}" was not found`,
  };
  return NextResponse.json(body, { status: 404 });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const csrfError = validateSameOrigin(request);
  if (csrfError) {
    return csrfError;
  }

  const { keyId } = await context.params;

  const meResponse = await coreFetch("/users/me");
  if (!meResponse.ok) {
    return proxyCoreResponse(meResponse);
  }

  const me = (await meResponse.json()) as UserResponse;

  const keysResponse = await coreFetch("/users/me/api-keys");
  if (!keysResponse.ok) {
    return proxyCoreResponse(keysResponse);
  }

  const apiKeys = (await keysResponse.json()) as ApiKeyResponse[];
  const ownsKey = apiKeys.some(
    (apiKey) => apiKey.id === keyId && apiKey.userId === me.id,
  );

  if (!ownsKey) {
    return notFoundResponse(keyId);
  }

  const deleteResponse = await adminFetch(
    `/admin/api-keys/${encodeURIComponent(keyId)}`,
    { method: "DELETE" },
  );

  return proxyCoreResponse(deleteResponse);
}
