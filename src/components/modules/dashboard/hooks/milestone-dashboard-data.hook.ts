"use client";

import { useEffect, useState } from "react";
import {
  MilestoneDashboardData,
  MilestoneWithEscrow,
} from "../@types/dashboard.entity";
import { Escrow } from "@/@types/escrow.entity";

type MilestoneWithInjectedFlags = MilestoneWithEscrow & {
  approved?: boolean;
  disputed?: boolean;
  released?: boolean;
};

export const useMilestoneDashboardData = ({
  address,
  type = "approver",
  escrows = [],
}: {
  address: string;
  type?: string;
  escrows?: Escrow[];
}): MilestoneDashboardData | null => {
  const [data, setData] = useState<MilestoneDashboardData | null>(null);

  useEffect(() => {
    const processData = () => {
      const allMilestones: MilestoneWithInjectedFlags[] = escrows.flatMap(
        (escrow) =>
          escrow.milestones.map((milestone) => ({
            ...milestone,
            escrowId: escrow.id,
            escrowTitle: escrow.title,
            disputed: escrow.flags?.disputed,
            released: escrow.flags?.released,
            approved: escrow.flags?.approved,
          })),
      );

      setData({
        totalMilestones: allMilestones.length,
        pendingApproval: allMilestones.filter(
          (m) => m.status === "completed" && !m.approved,
        ).length,
        approvedNotReleased: allMilestones.filter(
          (m) => m.approved && !m.released,
        ).length,
        disputed: allMilestones.filter((m) => m.disputed).length,
        milestoneStatusCounts: getMilestoneStatusCounts(allMilestones),
        milestoneApprovalTrend: getMilestoneApprovalTrend(allMilestones),
        milestonesByStatus: getMilestonesByStatus(allMilestones),
      });
    };

    if (address && escrows.length > 0) processData();
  }, [address, type, escrows]);

  return data;
};

const getMilestoneStatusCounts = (
  milestones: MilestoneWithInjectedFlags[],
): MilestoneDashboardData["milestoneStatusCounts"] => {
  const statusMap = new Map<string, number>();

  milestones.forEach((milestone) => {
    let status = "Pending";

    if (milestone.status === "completed" && !milestone.approved) {
      status = "Completed";
    } else if (milestone.approved) {
      status = "Approved";
    }

    if (milestone.disputed) {
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
  milestones: MilestoneWithInjectedFlags[],
): MilestoneDashboardData["milestoneApprovalTrend"] => {
  const approvedMilestones = milestones.filter((m) => m.approved);

  // Since we don't have approval timestamps, we'll return a simple count
  return [{ month: "current", count: approvedMilestones.length }];
};

const getMilestonesByStatus = (milestones: MilestoneWithInjectedFlags[]) => {
  return {
    pending: milestones.filter((m) => m.status === "pending").slice(0, 5),
    completed: milestones
      .filter((m) => m.status === "completed" && !m.approved)
      .slice(0, 5),
    approved: milestones.filter((m) => m.approved).slice(0, 5),
    disputed: milestones.filter((m) => m.disputed).slice(0, 5),
    platformFees: 0,
    depositsVsReleases: { deposits: 0, releases: 0, difference: 0 },
    pendingFunds: 0,
    feesByTimePeriod: { today: 0, last7Days: 0, last30Days: 0, allTime: 0 },
  };
};
