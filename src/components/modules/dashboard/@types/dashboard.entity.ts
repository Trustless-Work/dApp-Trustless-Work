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
};
