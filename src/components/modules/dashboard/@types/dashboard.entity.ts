import { Escrow } from "@/@types/escrow.entity";
import {
  SingleReleaseMilestone,
  MultiReleaseMilestone,
} from "@trustless-work/escrow";

export type DashboardData = {
  escrows: Escrow[];
  statusCounts: { name: string; count: number }[];
  top5ByValue: Escrow[];
  releaseTrend: { month: string; count: number }[];
  volumeTrend: { date: string; value: number }[];
  totalEscrows: number;
  totalResolved: number;
  totalReleased: number;
  totalInDispute: number;
  resolvedPercentage: number;
  isPositive: boolean;
  avgResolutionTime: number;
  platformFees: number;
  depositsVsReleases: {
    deposits: number;
    releases: number;
    difference: number;
  };
  pendingFunds: number;
  feesByTimePeriod: {
    today: number;
    last7Days: number;
    last30Days: number;
    allTime: number;
  };
};

export type MilestoneWithEscrow =
  | SingleReleaseMilestone
  | (MultiReleaseMilestone & {
      escrowId: string;
      escrowTitle: string;
      disputed?: boolean;
      released?: boolean;
    });

export type MilestoneDashboardData = {
  totalMilestones: number;
  pendingApproval: number;
  approvedNotReleased: number;
  disputed: number;
  milestoneStatusCounts: { name: string; count: number }[];
  milestoneApprovalTrend: { month: string; count: number }[];
  milestonesByStatus: {
    pending: MilestoneWithEscrow[];
    completed: MilestoneWithEscrow[];
    approved: MilestoneWithEscrow[];
    disputed: MilestoneWithEscrow[];
    platformFees: number;
    depositsVsReleases: {
      deposits: number;
      releases: number;
      difference: number;
    };
    pendingFunds: number;
    feesByTimePeriod: {
      today: number;
      last7Days: number;
      last30Days: number;
      allTime: number;
    };
  };
};
