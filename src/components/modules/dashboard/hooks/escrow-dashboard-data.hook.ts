import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Escrow } from "@/@types/escrows/escrow.entity";
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
        totalResolved: escrows.filter((e) => e.flags?.resolvedFlag).length,
        totalReleased: escrows.filter((e) => e.flags?.releaseFlag).length,
        totalInDispute: escrows.filter((e) => e.flags?.disputeFlag).length,
        resolvedPercentage: getResolvedPercentage(escrows),
        isPositive: getIsPositive(getResolvedPercentage(escrows)),
        avgResolutionTime: getAvgResolutionTime(escrows),
        platformFees: getPlatformFees(escrows),
        depositsVsReleases: getDepositsVsReleases(escrows),
        pendingFunds: getPendingFunds(escrows),
        feesByTimePeriod: getFeesByTimePeriod(escrows),
      });
    };

    if (address) fetchData();
  }, [address, type]);

  return data;
};

const getStatusCounts = (escrows: Escrow[]) => {
  const map = new Map<string, number>();
  escrows.forEach((escrow) => {
    const status = escrow.flags?.releaseFlag
      ? "Released"
      : escrow.flags?.disputeFlag
        ? "Disputed"
        : escrow.flags?.resolvedFlag
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
    if (escrow.flags?.releaseFlag && escrow.updatedAt?.seconds) {
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
  const resolvedCount = escrows.filter((e) => e.flags?.resolvedFlag).length;
  return Math.round((resolvedCount / escrows.length) * 100);
};

const getIsPositive = (resolvedPercentage: number): boolean => {
  return resolvedPercentage >= 50;
};

const getAvgResolutionTime = (escrows: Escrow[]): number => {
  const resolvedEscrows = escrows.filter((e) => e.flags?.resolvedFlag);
  return resolvedEscrows.length
    ? Math.round(
        resolvedEscrows
          .map((e) => {
            const start = e.createdAt.seconds * 1000;
            const end = (e.updatedAt ?? e.createdAt).seconds * 1000;
            return (end - start) / (1000 * 60 * 60 * 24);
          })
          .reduce((sum, days) => sum + days, 0) / resolvedEscrows.length,
      )
    : 0;
};

const getPlatformFees = (escrows: Escrow[]) => {
  return escrows.reduce((total, escrow) => {
    const fee = parseFloat(escrow.platformFee || "0");
    return total + fee;
  }, 0);
};

const getDepositsVsReleases = (escrows: Escrow[]) => {
  const deposits = escrows.reduce((total, escrow) => {
    return total + parseFloat(escrow.amount);
  }, 0);

  const releases = escrows
    .filter((e) => e.flags?.releaseFlag)
    .reduce((total, escrow) => {
      return total + parseFloat(escrow.amount);
    }, 0);

  return {
    deposits,
    releases,
    difference: deposits - releases,
  };
};

const getPendingFunds = (escrows: Escrow[]) => {
  return escrows
    .filter((e) => !e.flags?.releaseFlag && !e.flags?.disputeFlag)
    .reduce((total, escrow) => {
      return total + parseFloat(escrow.amount);
    }, 0);
};

const getFeesByTimePeriod = (escrows: Escrow[]) => {
  const today = new Date();
  const periods = {
    today: 0,
    last7Days: 0,
    last30Days: 0,
    allTime: 0,
  };

  escrows.forEach((escrow) => {
    const fee = parseFloat(escrow.platformFee || "0");
    const createdAt = new Date(escrow.createdAt.seconds * 1000);
    periods.allTime += fee;
    if (format(createdAt, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      periods.today += fee;
    }
    if (createdAt >= subDays(today, 7)) {
      periods.last7Days += fee;
    }
    if (createdAt >= subDays(today, 30)) {
      periods.last30Days += fee;
    }
  });

  return periods;
};
