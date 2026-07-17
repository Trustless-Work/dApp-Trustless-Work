import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/features/dashboard/types/dashboard.types";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import {
  DashboardCard,
  DashboardCardSeparator,
  DashboardCardTitle,
} from "./dashboard-card";

type DashboardStatsProps = {
  stats: readonly DashboardStat[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const { label, value, delta, hint } = stat;
  return (
    <DashboardCard className="group">
      <DashboardCardSeparator
        className={cn("absolute bottom-0 group-last:hidden lg:hidden")}
        orientation="horizontal"
      />
      <DashboardCardSeparator
        className={cn(
          "absolute right-0 hidden h-full group-last:hidden lg:block",
        )}
        orientation="vertical"
      />

      <div className="flex min-w-0 flex-col justify-center gap-2">
        <DashboardCardTitle>{label}</DashboardCardTitle>
        <span className="text-balance font-medium text-2xl tabular-nums tracking-tight">
          {value}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <Delta value={delta}>
          <DeltaIcon filled variant="arrow" />
          <DeltaValue />
        </Delta>
        <span className="text-pretty text-muted-foreground">{hint}</span>
      </div>
    </DashboardCard>
  );
}
