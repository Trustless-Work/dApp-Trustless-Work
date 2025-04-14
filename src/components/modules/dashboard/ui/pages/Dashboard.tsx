"use client";

import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowDashboardData } from "../../hooks/use-escrow-dashboard-data.hook";
import { EscrowStatusChart } from "../charts/EscrowStatusChart";
import { EscrowReleaseTrendChart } from "../charts/EscrowReleaseTrendChart";
import { EscrowVolumeTrendChart } from "../charts/EscrowVolumeTrendChart";
import { TopEscrowsList } from "../lists/TopEscrowsList";
import MetricsSection from "../cards/MetricSection";
import { EscrowVolumeTrendChartSkeleton } from "../utils/SkeletonEscrowVolumeTrendChart";

export default function Dashboard() {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

  const { statusCounts, releaseTrend, volumeTrend, top5ByValue } = data || {};

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <MetricsSection />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div className="md:col-span-2">
          {data ? (
            <EscrowVolumeTrendChart data={volumeTrend || []} />
          ) : (
            <EscrowVolumeTrendChartSkeleton />
          )}
        </div>

        <EscrowStatusChart data={statusCounts || []} />
        <EscrowReleaseTrendChart data={releaseTrend || []} />

        <div className="md:col-span-2">
          <TopEscrowsList data={top5ByValue || []} />
        </div>
      </div>
    </div>
  );
}
