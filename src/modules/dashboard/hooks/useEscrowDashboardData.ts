import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { DashboardData } from "../types/dashboard.entity";
import { Escrow } from "@/types/escrow.entity";
import { useEscrowsBySignerQuery } from "../../escrow/hooks/tanstack/useEscrowsBySignerQuery";
import { useGlobalAuthenticationStore } from "@/store/data";

export const useEscrowDashboardData = (): DashboardData | null => {
  const address = useGlobalAuthenticationStore((state) => state.address);

  const [data, setData] = useState<DashboardData | null>(null);
  const {
    data: escrows = [],
    isLoading,
    error,
  } = useEscrowsBySignerQuery({
    signer: address,
    isActive: true,
  });

  useEffect(() => {
    if (escrows.length > 0 || (!isLoading && !error)) {
      setData({
        escrows,
        statusCounts: getStatusCounts(escrows),
        top5ByValue: getTop5ByValue(escrows),
        releaseTrend: getReleaseTrend(escrows),
        volumeTrend: getVolumeTrend(escrows),
        totalEscrows: escrows.length,
        totalResolved: escrows.filter((e: Escrow) => e.flags?.resolved).length,
        totalReleased: escrows.filter((e: Escrow) => e.flags?.released).length,
        totalInDispute: escrows.filter((e: Escrow) => e.flags?.disputed).length,
        resolvedPercentage: getResolvedPercentage(escrows),
        isPositive: getIsPositive(getResolvedPercentage(escrows)),
        avgResolutionTime: getAvgResolutionTime(escrows),
        platformFees: getPlatformFees(escrows),
        depositsVsReleases: getDepositsVsReleases(escrows),
        pendingFunds: getPendingFunds(escrows),
        feesByTimePeriod: getFeesByTimePeriod(escrows),
      });
    }
  }, [escrows, isLoading, error]);

  return data;
};

const getStatusCounts = (escrows: Escrow[]) => {
  const map = new Map<string, number>();
  escrows.forEach((escrow) => {
    const status = escrow.flags?.released
      ? "Released"
      : escrow.flags?.disputed
        ? "Disputed"
        : escrow.flags?.resolved
          ? "Resolved"
          : "Pending";

    map.set(status, (map.get(status) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
};

const getTop5ByValue = (escrows: Escrow[]) => {
  const top5 = [...escrows]
    .sort(
      (a, b) =>
        parseFloat(b.amount?.toString() || "0") -
        parseFloat(a.amount?.toString() || "0"),
    )
    .slice(0, 5);

  return top5.sort((a, b) => {
    const getTimestamp = (e: Escrow) => {
      const ts = e.updatedAt || e.createdAt;
      if (!ts?._seconds || ts._seconds <= 0) {
        return 0;
      }
      return ts._seconds * 1000 + (ts._nanoseconds || 0) / 1_000_000;
    };

    return getTimestamp(b) - getTimestamp(a);
  });
};

const getReleaseTrend = (escrows: Escrow[]) => {
  const map = new Map<string, number>();

  escrows.forEach((escrow) => {
    if (
      escrow.flags?.released &&
      escrow.updatedAt?._seconds &&
      escrow.updatedAt._seconds > 0
    ) {
      try {
        const month = format(
          new Date(escrow.updatedAt._seconds * 1000),
          "yyyy-MM",
        );
        map.set(month, (map.get(month) || 0) + 1);
      } catch (error) {
        console.warn(
          "Invalid timestamp in escrow:",
          escrow.engagementId,
          error,
        );
      }
    }
  });

  return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
};

const getVolumeTrend = (escrows: Escrow[]) => {
  const map = new Map<string, number>();

  escrows.forEach((escrow) => {
    if (escrow.createdAt?._seconds && escrow.createdAt._seconds > 0) {
      try {
        const date = format(
          new Date(escrow.createdAt._seconds * 1000),
          "yyyy-MM-dd",
        );
        const value = parseFloat(escrow.amount?.toString() || "0");
        map.set(date, (map.get(date) || 0) + value);
      } catch (error) {
        console.warn(
          "Invalid timestamp in escrow:",
          escrow.engagementId,
          error,
        );
      }
    }
  });

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getResolvedPercentage = (escrows: Escrow[]): number => {
  if (escrows.length === 0) return 0;
  const resolvedCount = escrows.filter((e: Escrow) => e.flags?.resolved).length;
  return Math.round((resolvedCount / escrows.length) * 100);
};

const getIsPositive = (resolvedPercentage: number): boolean => {
  return resolvedPercentage >= 50;
};

const getAvgResolutionTime = (escrows: Escrow[]): number => {
  const resolvedEscrows = escrows.filter((e: Escrow) => e.flags?.resolved);
  return resolvedEscrows.length
    ? Math.round(
        resolvedEscrows
          .map((e: Escrow) => {
            if (!e.createdAt?._seconds || e.createdAt._seconds <= 0) {
              return 0;
            }
            const start = e.createdAt._seconds * 1000;
            const end =
              e.updatedAt?._seconds && e.updatedAt._seconds > 0
                ? e.updatedAt._seconds * 1000
                : start;
            return (end - start) / (1000 * 60 * 60 * 24);
          })
          .filter((days) => days > 0)
          .reduce((sum, days) => sum + days, 0) /
          resolvedEscrows.filter(
            (e) => e.createdAt?._seconds && e.createdAt._seconds > 0,
          ).length,
      )
    : 0;
};

const getPlatformFees = (escrows: Escrow[]) => {
  return escrows.reduce((total, escrow) => {
    const fee = parseFloat(escrow.platformFee?.toString() || "0");
    return total + fee;
  }, 0);
};

const getDepositsVsReleases = (escrows: Escrow[]) => {
  const deposits = escrows.reduce((total, escrow) => {
    return total + parseFloat(escrow.amount?.toString() || "0");
  }, 0);

  const releases = escrows
    .filter((e: Escrow) => e.flags?.released)
    .reduce((total, escrow) => {
      return total + parseFloat(escrow.amount?.toString() || "0");
    }, 0);

  return {
    deposits,
    releases,
    difference: deposits - releases,
  };
};

const getPendingFunds = (escrows: Escrow[]) => {
  return escrows
    .filter((e: Escrow) => !e.flags?.released && !e.flags?.disputed)
    .reduce((total, escrow) => {
      return total + parseFloat(escrow.amount?.toString() || "0");
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
    const fee = parseFloat(escrow.platformFee?.toString() || "0");
    if (escrow.createdAt?._seconds && escrow.createdAt._seconds > 0) {
      try {
        const createdAt = new Date(escrow.createdAt._seconds * 1000);
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
      } catch (error) {
        console.warn(
          "Invalid timestamp in escrow:",
          escrow.engagementId,
          error,
        );
        periods.allTime += fee; // Still count the fee even if date is invalid
      }
    } else {
      periods.allTime += fee; // Count fees even if no valid timestamp
    }
  });

  return periods;
};
