"use client";

import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowDashboardData } from "../../hooks/escrow-dashboard-data.hook";
import { EscrowStatusChart } from "../charts/EscrowStatusChart";
import { EscrowReleaseTrendChart } from "../charts/EscrowReleaseTrendChart";
import { EscrowVolumeTrendChart } from "../charts/EscrowVolumeTrendChart";
import { TopEscrowsList } from "../lists/TopEscrowsList";
import MetricsSection from "../cards/MetricSection";
import { ArrowRight } from "lucide-react";
import CreateButton from "@/components/utils/ui/Create";
import { MilestonesOverview } from "../sections/MilestoneOverview";
import { DisputeAnalytics } from "../sections/DisputeAnalytics";

export const Dashboard = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

  const { statusCounts, releaseTrend, volumeTrend, top5ByValue, escrows } =
    data || {};
  const hasData = data && data.totalEscrows > 0;
  const isLoading = !data;

  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  return (
    <>
      {!hasData &&
      (!data?.volumeTrend || !data?.statusCounts || !data?.releaseTrend) ? (
        <div className="flex items-center justify-end w-full gap-2">
          <span className="text-sm flex items-center text-muted-foreground mr-2">
            Don't have any escrow? <ArrowRight className="ml-2" />
          </span>
          <CreateButton
            className="mr-auto w-full md:w-auto"
            label="Create Escrow"
            url={"/dashboard/escrow/initialize-escrow"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-end w-full gap-2">
          <p className="text-xl flex items-center text-muted-foreground mr-2">
            Welcome back,{" "}
            <strong className="flex gap-2 ml-2">
              {loggedUser?.firstName || "Without Name"}!👋🏼
            </strong>
          </p>
        </div>
      )}

      <div className="flex flex-col w-full h-full gap-4">
        <MetricsSection />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="md:col-span-2">
            <EscrowVolumeTrendChart
              data={volumeTrend || []}
              isLoading={isLoading}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-3">
              <EscrowStatusChart
                data={statusCounts || []}
                isLoading={isLoading}
              />
            </div>

            <div className="md:col-span-7">
              <EscrowReleaseTrendChart
                data={releaseTrend || []}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <TopEscrowsList escrows={top5ByValue || []} />
          </div>
        </div>

        <MilestonesOverview address={address} escrows={escrows || []} />

        <DisputeAnalytics address={address} escrows={escrows || []} />
      </div>
    </>
  );
};
