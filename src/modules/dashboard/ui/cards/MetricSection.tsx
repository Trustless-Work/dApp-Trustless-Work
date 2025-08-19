"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Handshake,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUpIcon as TrendingUpDown,
  Hand,
  CircleCheckBig,
  Ban,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
  Lock,
  AlertCircle,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { useEscrowDashboardData } from "../../hooks/useEscrowDashboardData";
import { Button } from "@/ui/button";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/format";

const MetricsSection = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const data = useEscrowDashboardData();

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard isLoading title="Loading..." value="0" />
        <MetricCard isLoading title="Loading..." value="0" />
        <MetricCard isLoading title="Loading..." value="0" />
        <MetricCard isLoading title="Loading..." value="0" />
      </div>
    );
  }

  const { platformFees, depositsVsReleases, pendingFunds, totalInDispute } =
    data;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("dashboard.metrics.totalPlatformFees.title")}
          value={formatCurrency(platformFees, "USDC")}
          description={t("dashboard.metrics.totalPlatformFees.desc")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title={t("dashboard.metrics.netVolume.title")}
          value={formatCurrency(depositsVsReleases.difference, "USDC")}
          description={t("dashboard.metrics.netVolume.desc", {
            deposits: formatCurrency(depositsVsReleases.deposits, "USDC"),
            releases: formatCurrency(depositsVsReleases.releases, "USDC"),
          })}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title={t("dashboard.metrics.pendingFunds.title")}
          value={formatCurrency(pendingFunds, "USDC")}
          description={t("dashboard.metrics.pendingFunds.desc")}
          icon={<Lock className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title={t("dashboard.metrics.escrowsInDispute.title")}
          value={totalInDispute}
          description={t("dashboard.metrics.escrowsInDispute.desc")}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="expanded-metrics"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-hidden mt-4"
          >
            <MetricCard
              title={t("dashboard.metrics.totalEscrows.title")}
              value={String(data.totalEscrows).padStart(2, "0")}
              subValue={t("dashboard.metrics.totalEscrows.sub")}
              icon={<Layers className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title={t("dashboard.metrics.resolvedEscrows.title")}
              value={String(data.totalResolved).padStart(2, "0")}
              subValue={t("dashboard.metrics.resolvedEscrows.sub")}
              icon={<Handshake className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title={t("dashboard.metrics.releasedEscrows.title")}
              value={String(data.totalReleased).padStart(2, "0")}
              subValue={t("dashboard.metrics.releasedEscrows.sub")}
              icon={<CircleCheckBig className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title={t("dashboard.metrics.workingEscrows.title")}
              value={String(
                data.totalEscrows -
                  data.totalResolved -
                  data.totalInDispute -
                  data.totalReleased,
              ).padStart(2, "0")}
              subValue={t("dashboard.metrics.workingEscrows.sub")}
              icon={<Hand className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title={t("dashboard.metrics.inDisputeEscrows.title")}
              value={String(data.totalInDispute).padStart(2, "0")}
              subValue={t("dashboard.metrics.inDisputeEscrows.sub")}
              icon={<Ban className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title={t("dashboard.metrics.resolutionRate.title")}
              value={data.resolvedPercentage + "%"}
              subValue={
                <div className="flex items-center gap-1">
                  <p
                    className={`text-sm ${data.isPositive ? "text-green-500" : ""}`}
                  >
                    {t(
                      data.isPositive
                        ? "dashboard.metrics.resolutionRate.good"
                        : "dashboard.metrics.resolutionRate.bad",
                    )}
                  </p>

                  {data.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
              }
              icon={<TrendingUpDown className="h-7 w-7" />}
              isLoading={!data}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              {t("dashboard.metrics.actions.showLess")}
              <ChevronUp className="h-7 w-7" />
            </>
          ) : (
            <>
              {t("dashboard.metrics.actions.showMore")}
              <ChevronDown className="h-7 w-7" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MetricsSection;
