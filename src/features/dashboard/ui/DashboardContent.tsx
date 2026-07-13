import { cn } from "@/lib/utils";
import { DashboardStats } from "./stats";
import { DashboardCardSeparator } from "./dashboard-card";
import { MorChart } from "./mor-chart";
import { BudgetSentenceInsight } from "./budget-sentence-insight";
import { BudgetUsage } from "./budget-usage";
import { OrdersChart } from "./orders-chart";
import { TotalRevenue } from "./total-revenue";
import { ActiveCustomers } from "./active-customers";
import { FedIncomeTax } from "./fed-income-tax";
import { NeedsAttention } from "./needs-attention";

export const DashboardContent = () => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        "lg:grid-cols-[.68fr_.32fr] xl:grid-cols-[.70fr_.30fr]",
        "*:grid *:h-max *:gap-2",
      )}
    >
      <div>
        <DashboardStats />
        <DashboardCardSeparator />
        <MorChart />
        <DashboardCardSeparator />
        <div className="flex flex-col gap-2 py-4 xl:flex-row">
          <BudgetSentenceInsight />
          <DashboardCardSeparator
            className="block xl:hidden"
            orientation="horizontal"
          />
          <DashboardCardSeparator
            className="hidden xl:block"
            orientation="vertical"
          />
          <BudgetUsage />
        </div>
        <DashboardCardSeparator />
        <OrdersChart />
      </div>
      <div className="relative">
        <DashboardCardSeparator
          className="absolute inset-y-0 -left-2 hidden h-full w-px lg:block"
          orientation="vertical"
        />
        <DashboardCardSeparator
          className="block lg:hidden"
          orientation="horizontal"
        />
        <TotalRevenue />
        <DashboardCardSeparator />
        <ActiveCustomers />
        <DashboardCardSeparator />
        <FedIncomeTax />
        <DashboardCardSeparator />
        <NeedsAttention />
      </div>
    </div>
  );
};
