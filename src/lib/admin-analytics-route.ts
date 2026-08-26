import type { NextRequest } from "next/server";
import { adminFetch } from "@/lib/admin-fetch";
import { proxyCoreResponse } from "@/lib/bff-utils";
import { getAdminSession } from "@/features/admin-auth/services/admin-session.guard";
import { parseRequestNetwork } from "@/helpers/request-network.helper";
import {
  createAdminForbiddenResponse,
  parseAnalyticsSeriesParams,
  parseRevenueEventsParams,
} from "@/lib/admin-session-response";

export async function handleAdminAnalyticsGet(
  request: NextRequest,
  corePath: string,
): Promise<Response> {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return createAdminForbiddenResponse(session.status);
  }

  const network = parseRequestNetwork(request);
  const response = await adminFetch(corePath, { network });
  return proxyCoreResponse(response);
}

function buildSeriesQuery(params: {
  granularity: string;
  periods: number;
}): string {
  return `granularity=${params.granularity}&periods=${params.periods}`;
}

export async function handleAdminAnalyticsMonthlyGet(
  request: NextRequest,
  corePath: string,
): Promise<Response> {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return createAdminForbiddenResponse(session.status);
  }

  const parsed = parseAnalyticsSeriesParams(request.nextUrl.searchParams);
  if (!parsed.ok) {
    return parsed.error;
  }

  const network = parseRequestNetwork(request);
  const response = await adminFetch(
    `${corePath}?${buildSeriesQuery(parsed.value)}`,
    { network },
  );
  return proxyCoreResponse(response);
}

export async function handleAdminAnalyticsRevenueEventsGet(
  request: NextRequest,
): Promise<Response> {
  const session = await getAdminSession();
  if (session.status !== "ok") {
    return createAdminForbiddenResponse(session.status);
  }

  const parsed = parseRevenueEventsParams(request.nextUrl.searchParams);
  if (!parsed.ok) {
    return parsed.error;
  }

  const query = new URLSearchParams({
    limit: String(parsed.value.limit),
    offset: String(parsed.value.offset),
  });
  if (parsed.value.from) {
    query.set("from", parsed.value.from);
  }
  if (parsed.value.to) {
    query.set("to", parsed.value.to);
  }
  if (parsed.value.eventType) {
    query.set("eventType", parsed.value.eventType);
  }

  const network = parseRequestNetwork(request);
  const response = await adminFetch(
    `/analytics/revenue/events?${query.toString()}`,
    { network },
  );
  return proxyCoreResponse(response);
}
