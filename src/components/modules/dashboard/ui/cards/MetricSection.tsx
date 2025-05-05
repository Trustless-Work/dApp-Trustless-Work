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
import { useEscrowDashboardData } from "../../hooks/escrow-dashboard-data.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const MetricsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

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
          title="Total Platform Fees"
          value={formatCurrency(platformFees)}
          description="All-time platform fees collected"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Net Volume"
          value={formatCurrency(depositsVsReleases.difference)}
          description={`${formatCurrency(depositsVsReleases.deposits)} deposits - ${formatCurrency(depositsVsReleases.releases)} releases`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Pending Funds"
          value={formatCurrency(pendingFunds)}
          description="Funds currently locked in escrow"
          icon={<Lock className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Escrows in Dispute"
          value={totalInDispute}
          description="Active disputes requiring resolution"
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
              title="Total Escrows"
              value={String(data.totalEscrows).padStart(2, "0")}
              subValue="All time escrow count"
              icon={<Layers className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title="Resolved Escrows"
              value={String(data.totalResolved).padStart(2, "0")}
              subValue="Disputes successfully resolved"
              icon={<Handshake className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title="Released Escrows"
              value={String(data.totalReleased).padStart(2, "0")}
              subValue="Successfully released"
              icon={<CircleCheckBig className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title="Working Escrows"
              value={String(
                data.totalEscrows -
                  data.totalResolved -
                  data.totalInDispute -
                  data.totalReleased,
              ).padStart(2, "0")}
              subValue="Awaiting for milestone completion"
              icon={<Hand className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title="In Dispute Escrows"
              value={String(data.totalInDispute).padStart(2, "0")}
              subValue="Escrows in dispute"
              icon={<Ban className="h-7 w-7" />}
              isLoading={!data}
            />
            <MetricCard
              title="Resolution Rate"
              value={data.resolvedPercentage + "%"}
              subValue={
                <div className="flex items-center gap-1">
                  <p
                    className={`text-sm ${data.isPositive ? "text-green-500" : ""}`}
                  >
                    {data.isPositive ? "Good" : "Needs improvement"}
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
              Show Less Metrics
              <ChevronUp className="h-7 w-7" />
            </>
          ) : (
            <>
              Show More Metrics
              <ChevronDown className="h-7 w-7" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MetricsSection;
