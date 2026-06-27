import { coreFetch } from "@/lib/core-fetch";
import { clearSession } from "@/lib/session";
import { proxyCoreResponse } from "@/lib/bff-utils";

export async function POST() {
  const response = await coreFetch("/auth/session/logout", {
    method: "POST",
  });

  await clearSession();

  if (!response.ok && response.status !== 401) {
    return proxyCoreResponse(response);
  }

  return proxyCoreResponse(
    new Response(JSON.stringify({ loggedOut: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}
