import { adminFetch } from "@/lib/admin-fetch";
import { createUnauthorizedResponse } from "@/lib/core-fetch";
import { proxyCoreResponse } from "@/lib/bff-utils";
import { getSessionToken } from "@/lib/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return createUnauthorizedResponse();
  }

  const response = await adminFetch("/admin/users");
  return proxyCoreResponse(response);
}
