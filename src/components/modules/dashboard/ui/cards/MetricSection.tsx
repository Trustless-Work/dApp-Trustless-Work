"use client";

import { useState } from "react";
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
} from "lucide-react";
import MetricCard from "./MetricCard";
import { useEscrowDashboardData } from "../../hooks/use-escrow-dashboard-data.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Button } from "@/components/ui/button";

const MetricsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

  const {
    totalEscrows = 0,
    totalResolved = 0,
    totalReleased = 0,
    totalInDispute = 0,
    resolvedPercentage = 0,
    isPositive = false,
  } = data || {};

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Escrows"
          value={String(totalEscrows).padStart(2, "0")}
          subValue="All time escrow count"
          icon={<Layers className="h-7 w-7" />}
          isLoading={!data}
        />
        <MetricCard
          title="Resolved Escrows"
          value={String(totalResolved).padStart(2, "0")}
          subValue="Disputes successfully resolved"
          icon={<Handshake className="h-7 w-7" />}
          isLoading={!data}
        />
        <MetricCard
          title="Released Escrows"
          value={String(totalReleased).padStart(2, "0")}
          subValue="Successfully released"
          icon={<CircleCheckBig className="h-7 w-7" />}
          isLoading={!data}
        />
      </div>

      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <MetricCard
            title="Working Escrows"
            value={String(
              totalEscrows - totalResolved - totalInDispute - totalReleased,
            ).padStart(2, "0")}
            subValue="Awaiting for milestone completion"
            icon={<Hand className="h-7 w-7" />}
            isLoading={!data}
          />
          <MetricCard
            title="In Dispute Escrows"
            value={String(totalInDispute).padStart(2, "0")}
            subValue="Escrows in dispute"
            icon={<Ban className="h-7 w-7" />}
            isLoading={!data}
          />
          <MetricCard
            title="Resolution Rate"
            value={resolvedPercentage + "%"}
            subValue={
              <div className="flex items-center gap-1">
                <p className={`text-sm ${isPositive ? "text-green-500" : ""}`}>
                  {isPositive ? "Good" : "Needs improvement"}
                </p>

                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
              </div>
            }
            icon={<TrendingUpDown className="h-7 w-7" />}
            isLoading={!data}
          />
        </div>
      )}

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
