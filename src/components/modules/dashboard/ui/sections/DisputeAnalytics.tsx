import { Handshake, Clock, BarChart, Ban } from "lucide-react";
import MetricCard from "../cards/MetricCard";
import { useEscrowDashboardData } from "../../hooks/escrow-dashboard-data.hook";
import { Escrow } from "@/@types/escrow.entity";
import { SkeletonDisputeAnalytics } from "../utils/SkeletonDisputeAnalytics";
import { DisputesEngagementChart } from "../charts/DisputesEngagementChart";
import { LongestPendingDisputesList } from "../lists/LongestPendingDisputesList";
import { SkeletonDisputeEngagementChart } from "../utils/SkeletonDisputeEngagementChart";
import { SkeletonPendingDisputes } from "../utils/SkeletonPendingDisputes";

interface DisputeAnalyticsProps {
  address: string;
  type?: string;
  escrows: Escrow[];
}

export function DisputeAnalytics({
  address,
  type = "approver",
  escrows = [],
}: DisputeAnalyticsProps) {
  const data = useEscrowDashboardData({ address, type });
  const isLoading = !data;
  const displayData = data || {
    escrows: [],
    statusCounts: [],
    totalEscrows: 0,
    totalInDispute: 0,
    avgResolutionTime: 0,
  };
  const displayEscrows = escrows.length > 0 ? escrows : displayData.escrows;

  if (isLoading) {
    return <SkeletonDisputeAnalytics />;
  }

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <h1 className="text-2xl font-bold">Dispute Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Disputes"
          value={displayData.totalInDispute.toString()}
          icon={<Ban />}
          subValue="All time dispute count"
          isLoading={isLoading}
        />
        <MetricCard
          title="Dispute Rate"
          value={`${(displayData.totalEscrows > 0 ? (displayData.totalInDispute / displayData.totalEscrows) * 100 : 0).toFixed(1)}%`}
          icon={<BarChart />}
          subValue="Percentage of escrows in dispute"
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={
            displayData.avgResolutionTime > 0
              ? `${displayData.avgResolutionTime} ${displayData.avgResolutionTime === 1 ? "day" : "days"}`
              : "N/A"
          }
          icon={<Clock />}
          subValue="Average time to resolve disputes"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <DisputesEngagementChart
          escrows={displayEscrows}
          isLoading={isLoading}
        />
        {isLoading ? (
          <div className="space-y-4 mb-4">
            <h2 className="text-lg font-semibold">Longest Pending Disputes</h2>
            <SkeletonPendingDisputes />
          </div>
        ) : (
          <LongestPendingDisputesList escrows={displayEscrows} />
        )}
      </div>
    </div>
  );
}
