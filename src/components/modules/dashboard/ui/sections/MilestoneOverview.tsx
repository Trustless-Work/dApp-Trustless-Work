import { CheckCircle, Clock, AlertTriangle, FileCheck } from "lucide-react"
import MetricCard from "../cards/MetricCard"
import { MilestoneStatusChart } from "../charts/MilestoneStatusChart"
import { MilestoneApprovalTrendChart } from "../charts/MilestoneApprovalTrendChart"
import { useMilestoneDashboardData } from "../../hooks/milestone-dashboard-data.hook"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MilestonesOverviewProps {
  address: string
  type?: string
}

export function MilestonesOverview({ address, type = "approver" }: MilestonesOverviewProps) {
  const data = useMilestoneDashboardData({ address, type })
  const hasData = data !== null

  return (
    <div className="flex flex-col w-full h-full gap-4">
        <h1 className="text-2xl font-bold">Milestone Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Milestones"
          value={hasData ? data.totalMilestones : 0}
          icon={<FileCheck className="h-4 w-4 text-blue-500" />}
          subValue="Total milestones across all escrows"
          isLoading={!hasData}
        />
        <MetricCard
          title="Pending Approval"
          value={hasData ? data.pendingApproval : 0}
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
          subValue="Completed milestones awaiting approval"
          isLoading={!hasData}
        />
        <MetricCard
          title="Approved Not Released"
          value={hasData ? data.approvedNotReleased : 0}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          subValue="Approved milestones in unreleased escrows"
          isLoading={!hasData}
        />
        <MetricCard
          title="Disputed Milestones"
          value={hasData ? data.disputed : 0}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          subValue="Milestones in disputed escrows"
          isLoading={!hasData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="md:col-span-3">
          {hasData && data.milestoneStatusCounts.length > 0 ? (
            <MilestoneStatusChart data={data.milestoneStatusCounts} />
          ) : (
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-5 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex items-center justify-center">
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center">
                      <Skeleton className="h-3 w-3 mr-2 rounded-full" />
                      <Skeleton className="h-3 w-[60px]" />
                      <Skeleton className="h-3 w-[30px] ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-7">
          {hasData && data.milestoneApprovalTrend.length > 0 ? (
            <MilestoneApprovalTrendChart data={data.milestoneApprovalTrend} />
          ) : (
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-5 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
