import { NextRequest } from "next/server";
import { platformFetch } from "@/lib/platform-fetch";
import { parseJsonBody, proxyCoreResponse } from "@/lib/bff-utils";
import type { RegisterProfileInput } from "@/features/auth/types/auth.types";

type RegisterProfileRequest = RegisterProfileInput & {
  userId: string;
};

export async function POST(request: NextRequest) {
  const body = await parseJsonBody<RegisterProfileRequest>(request);

  if (!body.userId?.trim()) {
    return proxyCoreResponse(
      new Response(
        JSON.stringify({
          status: 400,
          code: "BAD_REQUEST",
          detail: "userId is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  }

  const firstName = body.firstName?.trim();
  if (!firstName) {
    return proxyCoreResponse(
      new Response(
        JSON.stringify({
          status: 400,
          code: "BAD_REQUEST",
          detail: "firstName is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  }

  const profilePayload: RegisterProfileInput = { firstName };

  const lastName = body.lastName?.trim();
  if (lastName) {
    profilePayload.lastName = lastName;
  }

  const email = body.email?.trim();
  if (email) {
    profilePayload.email = email;
  }

  const profileResponse = await platformFetch(
    `/admin/users/${body.userId.trim()}`,
    {
      method: "PATCH",
      body: JSON.stringify(profilePayload),
    },
  );

  return proxyCoreResponse(profileResponse);
}
