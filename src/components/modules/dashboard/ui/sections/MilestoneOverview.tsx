import { CheckCircle, Clock, AlertTriangle, FileCheck } from "lucide-react";
import MetricCard from "../cards/MetricCard";
import { MilestoneStatusChart } from "../charts/MilestoneStatusChart";
import { MilestoneApprovalTrendChart } from "../charts/MilestoneApprovalTrendChart";
import { useMilestoneDashboardData } from "../../hooks/milestone-dashboard-data.hook";
import { Escrow } from "@/@types/escrow.entity";
import { SkeletonMilestoneStatusChart } from "../utils/SkeletonMilestoneOverview";
import { SkeletonMilestoneApprovalTrendChart } from "../utils/SkeletonMilestoneApprovalChart";

interface MilestonesOverviewProps {
  address: string;
  type?: string;
  escrows: Escrow[];
}

export const MilestonesOverview = ({
  address,
  type = "approver",
  escrows = [],
}: MilestonesOverviewProps) => {
  const data = useMilestoneDashboardData({ address, type, escrows });
  const hasData = data !== null;

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <h1 className="text-2xl font-bold">Milestone Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Milestones"
          value={hasData ? data.totalMilestones : 0}
          icon={<FileCheck />}
          subValue="Total milestones across all escrows"
          isLoading={!hasData}
        />
        <MetricCard
          title="Pending Approval"
          value={hasData ? data.pendingApproval : 0}
          icon={<Clock />}
          subValue="Completed milestones awaiting approval"
          isLoading={!hasData}
        />
        <MetricCard
          title="Approved Not Released"
          value={hasData ? data.approvedNotReleased : 0}
          icon={<CheckCircle />}
          subValue="Approved milestones in unreleased escrows"
          isLoading={!hasData}
        />
        <MetricCard
          title="Disputed Milestones"
          value={hasData ? data.disputed : 0}
          icon={<AlertTriangle />}
          subValue="Milestones in disputed escrows"
          isLoading={!hasData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="md:col-span-3">
          {hasData ? (
            <MilestoneStatusChart data={data.milestoneStatusCounts} />
          ) : (
            <SkeletonMilestoneStatusChart />
          )}
        </div>

        <div className="md:col-span-7">
          {hasData ? (
            <MilestoneApprovalTrendChart data={data.milestoneApprovalTrend} />
          ) : (
            <SkeletonMilestoneApprovalTrendChart />
          )}
        </div>
      </div>
    </div>
  );
};
