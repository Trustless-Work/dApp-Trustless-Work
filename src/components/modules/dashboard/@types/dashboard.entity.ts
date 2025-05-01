import { Escrow, Milestone } from "@/@types/escrow.entity";

export type DashboardData = {
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
};

export type MilestoneWithEscrow = Milestone & {
  escrowId: string;
  escrowTitle: string;
  disputeFlag?: boolean;
  releaseFlag?: boolean;
};

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
  };
};
