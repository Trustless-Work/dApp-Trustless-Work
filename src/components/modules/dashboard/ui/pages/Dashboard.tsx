"use client";

import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowDashboardData } from "../../hooks/use-escrow-dashboard-data.hook";
import { EscrowStatusChart } from "../charts/EscrowStatusChart";
import { EscrowReleaseTrendChart } from "../charts/EscrowReleaseTrendChart";
import { EscrowVolumeTrendChart } from "../charts/EscrowVolumeTrendChart";
import { TopEscrowsList } from "../lists/TopEscrowsList";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Loader from "@/components/utils/ui/Loader";

export default function Dashboard() {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

  if (!data) {
    return <Loader isLoading={true} />;
  }

  const {
    statusCounts,
    releaseTrend,
    volumeTrend,
    top5ByValue,
    totalEscrows,
    totalResolved,
    resolvedPercentage,
    isPositive,
  } = data;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your escrow transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Escrows
                </p>
                <h2 className="text-3xl font-bold mt-1">{totalEscrows}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  All time escrow count
                </p>
              </div>
              <div className="text-xl bg-muted/60 rounded-md h-10 w-10 flex items-center justify-center">
                📦
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved Escrows
                </p>
                <h2 className="text-3xl font-bold mt-1">{totalResolved}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully completed
                </p>
              </div>
              <div className="text-xl bg-muted/60 rounded-md h-10 w-10 flex items-center justify-center">
                ✅
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolution Rate
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {resolvedPercentage}%
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <p
                    className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {isPositive ? "Good" : "Needs improvement"}
                  </p>
                </div>
              </div>
              <div className="text-xl bg-muted/60 rounded-md h-10 w-10 flex items-center justify-center">
                📊
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Escrows
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {totalEscrows - totalResolved}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting resolution
                </p>
              </div>
              <div className="text-xl bg-muted/60 rounded-md h-10 w-10 flex items-center justify-center">
                ⏳
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div className="md:col-span-2">
          <EscrowVolumeTrendChart data={volumeTrend} />
        </div>

        <EscrowStatusChart data={statusCounts} />
        <EscrowReleaseTrendChart data={releaseTrend} />

        <div className="md:col-span-2">
          <TopEscrowsList data={top5ByValue} />
        </div>
      </div>
    </div>
  );
}
