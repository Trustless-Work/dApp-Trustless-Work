import { NextRequest, NextResponse } from "next/server";

const BASE =
  process.env.NEXT_PUBLIC_ENV === "PROD"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_ENV === "DEV"
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_LOCAL;

async function proxyHandler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const apiKey = process.env.API_KEY || "";
  const { path } = await context.params;
  const targetPath = path.join("/");

  const url = new URL(req.url);
  const search = url.search
    ? url.search
    : url.searchParams.toString()
      ? `?${url.searchParams.toString()}`
      : "";
  const targetUrl = `${BASE}/${targetPath}${search}`.replace(/(?<!:)\/+/g, "/");

  const init: RequestInit = {
    method: req.method,
    headers: new Headers({
      "Content-Type": req.headers.get("content-type") || "application/json",
      "x-api-key": apiKey,
    }),
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.text();
    init.body = body;
  }

  try {
    const upstream = await fetch(targetUrl, init);
    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await upstream.json();
      return NextResponse.json(json, { status: upstream.status });
    }
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Proxy request failed", message: (e as Error).message },
      { status: 500 },
    );
  }
}

export const GET = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) => proxyHandler(req, ctx);
export const POST = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) => proxyHandler(req, ctx);
export const PUT = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) => proxyHandler(req, ctx);
export const PATCH = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) => proxyHandler(req, ctx);
export const DELETE = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) => proxyHandler(req, ctx);
