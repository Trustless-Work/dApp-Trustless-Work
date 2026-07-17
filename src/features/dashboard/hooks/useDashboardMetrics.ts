"use client";

import { useEscrowRest } from "@trustless-work/escrow";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { createDashboardMetricsService } from "@/features/dashboard/services/dashboard-metrics.service";
import { createEmptyDashboardMetrics } from "@/features/dashboard/utils/aggregate-dashboard.helper";
import { useActiveOrganization } from "@/providers/OrganizationProvider";

export function dashboardMetricsQueryKey(platformId: string | null) {
  return ["dashboard", "metrics", platformId ?? "none"] as const;
}

export function useDashboardMetrics() {
  const rest = useEscrowRest();
  const { activeOrganizationId, isLoading: isOrgLoading } =
    useActiveOrganization();

  const service = useMemo(
    () => createDashboardMetricsService({ rest }),
    [rest],
  );

  const query = useQuery({
    queryKey: dashboardMetricsQueryKey(activeOrganizationId),
    queryFn: () => service.fetchForPlatform(activeOrganizationId!),
    enabled: Boolean(activeOrganizationId),
    staleTime: 1000 * 30,
  });

  const metrics = query.data?.metrics ?? createEmptyDashboardMetrics();
  const isLoading =
    isOrgLoading || (Boolean(activeOrganizationId) && query.isPending);
  const isEmpty =
    !isLoading &&
    !query.isError &&
    ((query.data?.escrows.length ?? 0) === 0 || !activeOrganizationId);

  return {
    ...query,
    metrics,
    platformId: activeOrganizationId,
    isLoading,
    isEmpty,
    isError: Boolean(activeOrganizationId) && query.isError,
  };
}
