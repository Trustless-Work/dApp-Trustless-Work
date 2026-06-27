import { cn } from "@/lib/utils";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import {
  DashboardCard,
  DashboardCardSeparator,
  DashboardCardTitle,
} from "./dashboard-card";

type Stat = {
  label: string;
  value: string;
  delta: number;
  hint: string;
};

const stats: readonly Stat[] = [
  {
    label: "Repeat purchase rate",
    value: "38.4%",
    delta: 2.7,
    hint: "vs prior 30 days",
  },
  {
    label: "Orders",
    value: "1,842",
    delta: 4.1,
    hint: "vs prior 30 days",
  },
  {
    label: "Average order value",
    value: "$154.60",
    delta: -1.3,
    hint: "vs prior 30 days",
  },
] as const;

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
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
