"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_ANALYTICS_RANGE } from "@/features/admin-analytics/constants/analytics-range";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import { useDataQuality } from "@/features/admin-analytics/hooks/useAdminAnalytics";
import { AdminAnalyticsSkeleton } from "@/features/admin-analytics/ui/AdminAnalyticsSkeleton";
import {
  AnalyticsTabs,
  resolveAnalyticsTab,
} from "@/features/admin-analytics/ui/AnalyticsTabs";
import { DataQualityBanner } from "@/features/admin-analytics/ui/DataQualityBanner";
import { GrowthTabSkeleton } from "@/features/admin-analytics/ui/tabs/GrowthTabSkeleton";
import { RevenueTabSkeleton } from "@/features/admin-analytics/ui/tabs/RevenueTabSkeleton";
import { EscrowsTabSkeleton } from "@/features/admin-analytics/ui/tabs/EscrowsTabSkeleton";

const GrowthTab = dynamic(
  () =>
    import("@/features/admin-analytics/ui/tabs/GrowthTab").then((mod) => ({
      default: mod.GrowthTab,
    })),
  { loading: () => <GrowthTabSkeleton /> },
);

const RevenueTab = dynamic(
  () =>
    import("@/features/admin-analytics/ui/tabs/RevenueTab").then((mod) => ({
      default: mod.RevenueTab,
    })),
  { loading: () => <RevenueTabSkeleton /> },
);

const EscrowsTab = dynamic(
  () =>
    import("@/features/admin-analytics/ui/tabs/EscrowsTab").then((mod) => ({
      default: mod.EscrowsTab,
    })),
  { loading: () => <EscrowsTabSkeleton /> },
);

export const AdminAnalyticsView = () => {
  const searchParams = useSearchParams();
  const activeTab = resolveAnalyticsTab(searchParams.get("tab"));
  const [range, setRange] = useState<AnalyticsRange>(DEFAULT_ANALYTICS_RANGE);
  const dataQualityQuery = useDataQuality();

  const handleRangeChange = useCallback((nextRange: AnalyticsRange) => {
    setRange(nextRange);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <DataQualityBanner data={dataQualityQuery.data} />

      <Suspense fallback={<AdminAnalyticsSkeleton />}>
        <AnalyticsTabs
          activeTab={activeTab}
          escrowsContent={<EscrowsTab />}
          growthContent={<GrowthTab range={range} />}
          range={range}
          revenueContent={<RevenueTab range={range} />}
          onRangeChange={handleRangeChange}
        />
      </Suspense>
    </div>
  );
};
