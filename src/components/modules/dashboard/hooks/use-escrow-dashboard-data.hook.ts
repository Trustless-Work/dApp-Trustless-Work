import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Escrow } from "@/@types/escrow.entity";
import { fetchAllEscrows } from "../../escrow/services/escrow.service";

type DashboardData = {
  statusCounts: { name: string; count: number }[];
  top5ByValue: Escrow[];
  releaseTrend: { date: string; count: number }[];
  volumeTrend: { date: string; value: number }[];
};

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
      console.log(escrows);

      setData({
        statusCounts: getStatusCounts(escrows),
        top5ByValue: getTop5ByValue(escrows),
        releaseTrend: getReleaseTrend(escrows),
        volumeTrend: getVolumeTrend(escrows),
      });
    };

    if (address) fetchData();
  }, [address, type]);
  console.log("Dashboard data", data);

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
  return [...escrows]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 5);
};

const getReleaseTrend = (escrows: Escrow[]) => {
  const map = new Map<string, number>();

  escrows.forEach((escrow) => {
    if (escrow.releaseFlag && escrow.updatedAt?.seconds) {
      const date = format(
        new Date(escrow.updatedAt.seconds * 1000),
        "yyyy-MM-dd",
      );
      map.set(date, (map.get(date) || 0) + 1);
    }
  });

  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
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

  return Array.from(map.entries()).map(([date, value]) => ({ date, value }));
};
