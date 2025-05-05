import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Escrow } from "@/@types/escrow.entity";
import { fetchAllEscrows } from "../../escrow/services/escrow.service";
import { DashboardData } from "../@types/dashboard.entity";

export const useEscrowDashboardData = ({
  address,
  type = "approver",
}: {
  address: string;
  type?: string;
}): DashboardData | null => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const escrows = await fetchAllEscrows({ address, type });

      setData({
        escrows,
        statusCounts: getStatusCounts(escrows),
        top5ByValue: getTop5ByValue(escrows),
        releaseTrend: getReleaseTrend(escrows),
        volumeTrend: getVolumeTrend(escrows),
        totalEscrows: escrows.length,
        totalResolved: escrows.filter((e) => e.resolvedFlag).length,
        totalReleased: escrows.filter((e) => e.releaseFlag).length,
        totalInDispute: escrows.filter((e) => e.disputeFlag).length,
        resolvedPercentage: getResolvedPercentage(escrows),
        isPositive: getIsPositive(getResolvedPercentage(escrows)),
        avgResolutionTime: getAvgResolutionTime(escrows),
      });
    };

    if (address) fetchData();
  }, [address, type]);

  return data;
};

const getStatusCounts = (escrows: Escrow[]) => {
  const map = new Map<string, number>();
  escrows.forEach((escrow) => {
    const status = escrow.releaseFlag
      ? "Released"
      : escrow.disputeFlag
        ? "Disputed"
        : escrow.resolvedFlag
          ? "Resolved"
          : "Pending";

    map.set(status, (map.get(status) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
};

const getTop5ByValue = (escrows: Escrow[]) => {
  const top5 = [...escrows]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 5);

  return top5.sort((a, b) => {
    const getTimestamp = (e: Escrow) => {
      const ts = e.updatedAt || e.createdAt;
      return ts.seconds * 1000 + ts.nanoseconds / 1_000_000;
    };

    return getTimestamp(b) - getTimestamp(a);
  });
};

const getReleaseTrend = (escrows: Escrow[]) => {
  const map = new Map<string, number>();

  escrows.forEach((escrow) => {
    if (escrow.releaseFlag && escrow.updatedAt?.seconds) {
      const month = format(
        new Date(escrow.updatedAt.seconds * 1000),
        "yyyy-MM",
      );
      map.set(month, (map.get(month) || 0) + 1);
    }
  });

  return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
};

const getVolumeTrend = (escrows: Escrow[]) => {
  const map = new Map<string, number>();

  escrows.forEach((escrow) => {
    const date = format(
      new Date(escrow.createdAt.seconds * 1000),
      "yyyy-MM-dd",
    );
    const value = parseFloat(escrow.amount);
    map.set(date, (map.get(date) || 0) + value);
  });

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getResolvedPercentage = (escrows: Escrow[]): number => {
  if (escrows.length === 0) return 0;
  const resolvedCount = escrows.filter((e) => e.resolvedFlag).length;
  return Math.round((resolvedCount / escrows.length) * 100);
};

const getIsPositive = (resolvedPercentage: number): boolean => {
  return resolvedPercentage >= 50;
};

const getAvgResolutionTime = (escrows: Escrow[]): number => {
  const resolvedEscrows = escrows.filter((e) => e.resolvedFlag);
  return resolvedEscrows.length
    ? Math.round(
      resolvedEscrows
        .map((e) => {
          const start = e.createdAt.seconds * 1000;
          const end = (e.updatedAt ?? e.createdAt).seconds * 1000;
          return (end - start) / (1000 * 60 * 60 * 24);
        })
        .reduce((sum, days) => sum + days, 0) /
      resolvedEscrows.length
    )
    : 0;
};
