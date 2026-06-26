import { NextRequest, NextResponse } from "next/server";
import type { ProblemDetails } from "@/lib/api-error";

export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
  return request.json() as Promise<T>;
}

export async function proxyCoreResponse(response: Response): Promise<NextResponse> {
  const text = await response.text();
  const contentType =
    response.headers.get("content-type") ?? "application/json";

  if (!text) {
    return new NextResponse(null, { status: response.status });
  }

  try {
    const data = JSON.parse(text) as unknown;
    return NextResponse.json(data, { status: response.status });
  } catch {
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": contentType },
    });
  }
}

export function validateSameOrigin(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    const body: ProblemDetails = {
      status: 403,
      code: "FORBIDDEN",
      detail: "Cross-origin requests are not allowed",
    };
    return NextResponse.json(body, { status: 403 });
  }

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    const body: ProblemDetails = {
      status: 403,
      code: "FORBIDDEN",
      detail: "Cross-origin requests are not allowed",
    };
    return NextResponse.json(body, { status: 403 });
  }

  return null;
}
