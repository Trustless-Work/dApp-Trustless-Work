import { NextRequest } from "next/server";
import { coreFetch } from "@/lib/core-fetch";
import { proxyCoreResponse, validateSameOrigin } from "@/lib/bff-utils";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return handleCoreProxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return handleCoreProxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return handleCoreProxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return handleCoreProxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return handleCoreProxy(request, context);
}

async function handleCoreProxy(
  request: NextRequest,
  context: RouteContext,
) {
  const csrfError = validateSameOrigin(request);
  if (csrfError) {
    return csrfError;
  }

  const { path } = await context.params;
  const corePath = `/${path.join("/")}`;
  const search = request.nextUrl.search;

  const init: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.text();
    if (body) {
      init.body = body;
    }
  }

  const response = await coreFetch(`${corePath}${search}`, init);
  return proxyCoreResponse(response);
}
