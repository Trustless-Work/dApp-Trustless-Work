import {
  Layers,
  Handshake,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUpDown,
  Hand,
  CircleCheckBig,
  Ban,
} from "lucide-react";
import MetricCard from "./MetricCard";
import { useEscrowDashboardData } from "../../hooks/use-escrow-dashboard-data.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";

const MetricsSection = () => {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Escrows"
        value={String(totalEscrows).padStart(2, "0")}
        subValue="All time escrow count"
        icon={<Layers className="h-4 w-4" />}
        isLoading={!data}
      />
      <MetricCard
        title="Resolved Escrows"
        value={String(totalResolved).padStart(2, "0")}
        subValue="Disputes successfully resolved"
        icon={<Handshake className="h-4 w-4" />}
        isLoading={!data}
      />
      <MetricCard
        title="Released Escrows"
        value={String(totalReleased).padStart(2, "0")}
        subValue="Successfully released"
        icon={<CircleCheckBig className="h-4 w-4" />}
        isLoading={!data}
      />
      <MetricCard
        title="Working Escrows"
        value={String(totalEscrows - totalResolved).padStart(2, "0")}
        subValue="Awaiting for milestone completion"
        icon={<Hand className="h-4 w-4" />}
        isLoading={!data}
      />
      <MetricCard
        title="In Dispute Escrows"
        value={String(totalInDispute).padStart(2, "0")}
        subValue="Escrows in dispute"
        icon={<Ban className="h-4 w-4" />}
        isLoading={!data}
      />
      <MetricCard
        title="Resolution Rate"
        value={resolvedPercentage + "%"}
        subValue={
          <div className="flex items-center gap-1">
            <p className={`text-sm ${isPositive && "text-green-500"}`}>
              {isPositive ? "Good" : "Needs improvement"}
            </p>

            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
          </div>
        }
        icon={<TrendingUpDown className="h-4 w-4" />}
        isLoading={!data}
      />
    </div>
  );
};

export default MetricsSection;
