import type {
  EscrowFinancial,
  EscrowRestService,
  EscrowSummary,
} from "@trustless-work/escrow";
import {
  aggregateDashboardMetrics,
  daysAgoIso,
} from "@/features/dashboard/utils/aggregate-dashboard.helper";
import type { DashboardMetrics } from "@/features/dashboard/types/dashboard.types";
import { DEFAULT_KEYSET_LIMIT } from "@/types/pagination.entity";

export type DashboardMetricsServices = {
  rest: EscrowRestService;
};

const WINDOW_DAYS = 30;

export function createDashboardMetricsService(
  services: DashboardMetricsServices,
) {
  return {
    async fetchForPlatform(platformId: string): Promise<{
      metrics: DashboardMetrics;
      escrows: EscrowSummary[];
      financials: EscrowFinancial[];
    }> {
      const resolvedPlatformId = platformId.trim();
      if (!resolvedPlatformId) {
        return {
          metrics: aggregateDashboardMetrics({
            escrows: [],
            financials: [],
          }),
          escrows: [],
          financials: [],
        };
      }

      const page = await services.rest.listEscrows({
        scope: "all",
        platformId: resolvedPlatformId,
        createdAfter: daysAgoIso(WINDOW_DAYS),
        limit: DEFAULT_KEYSET_LIMIT,
        sort: "createdAt",
        order: "desc",
      });

      const escrows = page.data;
      const contractIds = escrows.map((row) => row.contractId);

      const financials =
        contractIds.length > 0
          ? (
              await services.rest.getEscrowsFinancial({
                contractIds,
              })
            ).data
          : [];

      return {
        metrics: aggregateDashboardMetrics({ escrows, financials }),
        escrows,
        financials,
      };
    },
  };
}

export type DashboardMetricsService = ReturnType<
  typeof createDashboardMetricsService
>;
