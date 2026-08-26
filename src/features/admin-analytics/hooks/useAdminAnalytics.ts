import { useQuery } from "@tanstack/react-query";
import { getStoredNetwork } from "@/lib/client-storage";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import { rangeQueryKey } from "@/features/admin-analytics/constants/analytics-range";
import {
  adminAnalyticsService,
} from "@/features/admin-analytics/services/admin-analytics.service";
import type { RevenueEventsQuery } from "@/features/admin-analytics/types/analytics.types";
import {
  ADMIN_ANALYTICS_REFETCH_INTERVAL,
  ADMIN_ANALYTICS_STALE_TIME,
  adminAnalyticsQueryKey,
  getAdminAnalyticsErrorMessage,
  shouldRetryAdminAnalytics,
} from "@/features/admin-analytics/utils/analytics-query.util";

const sharedQueryOptions = {
  staleTime: ADMIN_ANALYTICS_STALE_TIME,
  refetchInterval: ADMIN_ANALYTICS_REFETCH_INTERVAL,
  retry: shouldRetryAdminAnalytics,
} as const;

function networkQueryKey(): string {
  return getStoredNetwork();
}

export function useEscrowGrowth(range: AnalyticsRange) {
  const query = useQuery({
    queryKey: adminAnalyticsQueryKey(
      "escrows-monthly",
      networkQueryKey(),
      rangeQueryKey(range),
    ),
    queryFn: () => adminAnalyticsService.getEscrowGrowth(range),
    ...sharedQueryOptions,
  });

  return {
    ...query,
    errorMessage: query.error
      ? getAdminAnalyticsErrorMessage(query.error)
      : null,
  };
}

export function useUserGrowth(range: AnalyticsRange) {
  const query = useQuery({
    queryKey: adminAnalyticsQueryKey(
      "users-monthly",
      networkQueryKey(),
      rangeQueryKey(range),
    ),
    queryFn: () => adminAnalyticsService.getUserGrowth(range),
    ...sharedQueryOptions,
  });

  return {
    ...query,
    errorMessage: query.error
      ? getAdminAnalyticsErrorMessage(query.error)
      : null,
  };
}

export function useRevenueByToken(range: AnalyticsRange) {
  const query = useQuery({
    queryKey: adminAnalyticsQueryKey(
      "revenue-monthly",
      networkQueryKey(),
      rangeQueryKey(range),
    ),
    queryFn: () => adminAnalyticsService.getRevenueByToken(range),
    ...sharedQueryOptions,
  });

  return {
    ...query,
    errorMessage: query.error
      ? getAdminAnalyticsErrorMessage(query.error)
      : null,
  };
}

export function useRevenueEvents(
  range: AnalyticsRange,
  query: RevenueEventsQuery,
) {
  const eventsQuery = useQuery({
    queryKey: adminAnalyticsQueryKey(
      "revenue-events",
      networkQueryKey(),
      rangeQueryKey(range),
      query.limit,
      query.offset,
      query.eventType ?? "all",
    ),
    queryFn: () => adminAnalyticsService.getRevenueEvents(range, query),
    ...sharedQueryOptions,
  });

  return {
    ...eventsQuery,
    errorMessage: eventsQuery.error
      ? getAdminAnalyticsErrorMessage(eventsQuery.error)
      : null,
  };
}

export function useStatusFunnel() {
  const query = useQuery({
    queryKey: adminAnalyticsQueryKey("escrows-status", networkQueryKey()),
    queryFn: () => adminAnalyticsService.getStatusFunnel(),
    ...sharedQueryOptions,
  });

  return {
    ...query,
    errorMessage: query.error
      ? getAdminAnalyticsErrorMessage(query.error)
      : null,
  };
}

export function useDataQuality() {
  const query = useQuery({
    queryKey: adminAnalyticsQueryKey("data-quality", networkQueryKey()),
    queryFn: () => adminAnalyticsService.getDataQuality(),
    ...sharedQueryOptions,
  });

  return {
    ...query,
    errorMessage: query.error
      ? getAdminAnalyticsErrorMessage(query.error)
      : null,
  };
}
