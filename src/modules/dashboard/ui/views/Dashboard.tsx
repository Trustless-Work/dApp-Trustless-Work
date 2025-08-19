"use client";

import { useGlobalAuthenticationStore } from "@/store/data";
import { useEscrowDashboardData } from "../../hooks/useEscrowDashboardData";
import { EscrowStatusChart } from "../charts/EscrowStatusChart";
import { EscrowReleaseTrendChart } from "../charts/EscrowReleaseTrendChart";
import { EscrowVolumeTrendChart } from "../charts/EscrowVolumeTrendChart";
import { TopEscrowsList } from "../lists/TopEscrowsList";
import MetricsSection from "../cards/MetricSection";
import { ArrowRight } from "lucide-react";
import CreateButton from "@/shared/utils/Create";
import { MilestonesOverview } from "../sections/MilestoneOverview";
import { DisputeAnalytics } from "../sections/DisputeAnalytics";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Dashboard = () => {
  const { t } = useTranslation();
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData();
  const [selectedTab, setSelectedTab] = useState("general");

  const { statusCounts, releaseTrend, volumeTrend, top5ByValue, escrows } =
    data || {};
  const hasData = data && data.totalEscrows > 0;
  const isLoading = !data;

  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const renderTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "general":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <h1 className="text-2xl font-bold">
                {t("dashboard.sections.escrowOverview")}
              </h1>
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
          </div>
        );
      case "milestone-overview":
        return (
          <div className="space-y-4">
            <MilestonesOverview address={address} escrows={escrows || []} />
          </div>
        );
      case "dispute-analytics":
        return (
          <div className="space-y-4">
            <DisputeAnalytics escrows={escrows || []} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!hasData &&
      (!data?.volumeTrend || !data?.statusCounts || !data?.releaseTrend) ? (
        <div className="flex items-center justify-end w-full gap-2">
          <span className="text-sm flex items-center text-muted-foreground mr-2">
            {t("dashboard.noEscrows")} <ArrowRight className="ml-2" />
          </span>
          <CreateButton
            label={t("dashboard.createEscrow")}
            url={"/dashboard/escrow/initialize-escrow"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-end w-full gap-2">
          <p className="text-xl flex items-center text-muted-foreground mr-2">
            {t("dashboard.welcomeBack")}{" "}
            <strong className="flex gap-2 ml-2">
              {loggedUser?.firstName || t("dashboard.fallbackName")}!👋🏼
            </strong>
          </p>
        </div>
      )}

      <div className="flex flex-col w-full h-full gap-4">
        <MetricsSection />

        {/* Mobile Select - Hidden on md and larger screens */}
        <div className="md:hidden mb-6">
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("dashboard.tabs.general")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                {t("dashboard.tabs.general")}
              </SelectItem>
              <SelectItem value="milestone-overview">
                {t("dashboard.tabs.milestoneOverview")}
              </SelectItem>
              <SelectItem value="dispute-analytics">
                {t("dashboard.tabs.disputeAnalytics")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs - Hidden on screens smaller than md */}
        <div className="hidden md:block">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-10">
              <TabsTrigger value="general">
                {t("dashboard.tabs.general")}
              </TabsTrigger>
              <TabsTrigger value="milestone-overview">
                {t("dashboard.tabs.milestoneOverview")}
              </TabsTrigger>
              <TabsTrigger value="dispute-analytics">
                {t("dashboard.tabs.disputeAnalytics")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content - Shared between mobile and desktop */}
        {renderTabContent(selectedTab)}
      </div>
    </>
  );
};
