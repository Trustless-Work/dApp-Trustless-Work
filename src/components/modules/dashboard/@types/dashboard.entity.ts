import { Escrow } from "@/@types/escrow.entity";

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
