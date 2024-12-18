import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

export function MetricsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(45231.89)}
        subValue={`${formatPercentage(20.1)} from last month`}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Subscriptions"
        value={formatNumber(2350)}
        subValue={`${formatPercentage(180.1)} from last month`}
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Sales"
        value={formatNumber(12234)}
        subValue={`${formatPercentage(19)} from last month`}
        icon={<CreditCard className="h-4 w-4" />}
      />
      <MetricCard
        title="Active Now"
        value={formatNumber(573)}
        subValue={`${formatPercentage(201)} since last hour`}
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}