import { NextRequest } from "next/server";
import { platformFetch } from "@/lib/platform-fetch";
import { parseJsonBody, proxyCoreResponse } from "@/lib/bff-utils";
import type {
  GeneratedApiKeyResponse,
  RegisterVerifyRequest,
} from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody<RegisterVerifyRequest>(request);

  const response = await platformFetch("/auth/register/verify", {
    method: "POST",
    body: JSON.stringify({
      address: body.address,
      signedXdr: body.signedXdr,
    }),
  });

  return proxyCoreResponse(response);
}
