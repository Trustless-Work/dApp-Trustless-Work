"use client";

import { useEffect, useState } from "react";
import { fetchAllEscrows } from "../../escrow/services/escrow.service";
import {
  MilestoneDashboardData,
  MilestoneWithEscrow,
} from "../@types/dashboard.entity";

export const useMilestoneDashboardData = ({
  address,
  type = "approver",
}: {
  address: string;
  type?: string;
}): MilestoneDashboardData | null => {
  const [data, setData] = useState<MilestoneDashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const escrows = await fetchAllEscrows({ address, type });
      const allMilestones = escrows.flatMap((escrow) =>
        escrow.milestones.map((milestone) => ({
          ...milestone,
          escrowId: escrow.id,
          escrowTitle: escrow.title,
          disputeFlag: escrow.disputeFlag,
          releaseFlag: escrow.releaseFlag,
        })),
      );

      setData({
        totalMilestones: allMilestones.length,
        pendingApproval: allMilestones.filter(
          (m) => m.status === "completed" && !m.approved_flag,
        ).length,
        approvedNotReleased: allMilestones.filter(
          (m) => m.approved_flag && !m.releaseFlag,
        ).length,
        disputed: allMilestones.filter((m) => m.disputeFlag).length,
        milestoneStatusCounts: getMilestoneStatusCounts(allMilestones),
        milestoneApprovalTrend: getMilestoneApprovalTrend(allMilestones),
        milestonesByStatus: getMilestonesByStatus(allMilestones),
      });
    };

    if (address) fetchData();
  }, [address, type]);

  return data;
};

const getMilestoneStatusCounts = (
  milestones: MilestoneWithEscrow[],
): MilestoneDashboardData["milestoneStatusCounts"] => {
  const statusMap = new Map<string, number>();

  milestones.forEach((milestone) => {
    let status = "Pending";

    if (milestone.status === "completed" && !milestone.approved_flag) {
      status = "Completed";
    } else if (milestone.approved_flag) {
      status = "Approved";
    }

    if (milestone.disputeFlag) {
      status = "Disputed";
    }

    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  return Array.from(statusMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));
};

const getMilestoneApprovalTrend = (
  milestones: MilestoneWithEscrow[],
): MilestoneDashboardData["milestoneApprovalTrend"] => {
  const approvedMilestones = milestones.filter(
    (m) => m.approved_flag && m.approvedAt,
  );
  const monthMap = new Map<string, number>();

  approvedMilestones.forEach((milestone) => {
    if (milestone.approvedAt?.seconds) {
      const date = new Date(milestone.approvedAt.seconds * 1000);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    }
  });

  return Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const getMilestonesByStatus = (milestones: MilestoneWithEscrow[]) => {
  return {
    pending: milestones.filter((m) => m.status === "pending").slice(0, 5),
    completed: milestones
      .filter((m) => m.status === "completed" && !m.approved_flag)
      .slice(0, 5),
    approved: milestones.filter((m) => m.approved_flag).slice(0, 5),
    disputed: milestones.filter((m) => m.disputeFlag).slice(0, 5),
  };
};
