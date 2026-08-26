import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import { rangeQueryKey } from "@/features/admin-analytics/constants/analytics-range";
import {
  getUtcRangeBounds,
  seriesParams,
} from "@/features/admin-analytics/utils/analytics-range.util";
import adminHttp from "@/lib/admin-http";
import {
  dataQualityResponseSchema,
  escrowGrowthResponseSchema,
  revenueByTokenResponseSchema,
  revenueEventsResponseSchema,
  statusFunnelResponseSchema,
  userGrowthResponseSchema,
} from "@/features/admin-analytics/schemas/analytics.schema";
import type {
  DataQualityResponse,
  EscrowGrowthResponse,
  RevenueByTokenResponse,
  RevenueEventsQuery,
  RevenueEventsResponse,
  StatusFunnelResponse,
  UserGrowthResponse,
} from "@/features/admin-analytics/types/analytics.types";

const ANALYTICS_BASE = "/admin/analytics";

export const adminAnalyticsService = {
  async getEscrowGrowth(range: AnalyticsRange): Promise<EscrowGrowthResponse> {
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/escrows/monthly`,
      { params: seriesParams(range) },
    );
    return escrowGrowthResponseSchema.parse(data);
  },

  async getUserGrowth(range: AnalyticsRange): Promise<UserGrowthResponse> {
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/users/monthly`,
      { params: seriesParams(range) },
    );
    return userGrowthResponseSchema.parse(data);
  },

  async getRevenueByToken(
    range: AnalyticsRange,
  ): Promise<RevenueByTokenResponse> {
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/revenue/monthly`,
      { params: seriesParams(range) },
    );
    return revenueByTokenResponseSchema.parse(data);
  },

  async getRevenueEvents(
    range: AnalyticsRange,
    query: RevenueEventsQuery,
  ): Promise<RevenueEventsResponse> {
    const bounds = getUtcRangeBounds(range);
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/revenue/events`,
      {
        params: {
          limit: query.limit,
          offset: query.offset,
          from: query.from ?? bounds.from,
          to: query.to ?? bounds.to,
          ...(query.eventType ? { eventType: query.eventType } : {}),
        },
      },
    );
    return revenueEventsResponseSchema.parse(data);
  },

  async getStatusFunnel(): Promise<StatusFunnelResponse> {
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/escrows/status`,
    );
    return statusFunnelResponseSchema.parse(data);
  },

  async getDataQuality(): Promise<DataQualityResponse> {
    const { data } = await adminHttp.get<unknown>(
      `${ANALYTICS_BASE}/data-quality`,
    );
    return dataQualityResponseSchema.parse(data);
  },
};

export { rangeQueryKey };
