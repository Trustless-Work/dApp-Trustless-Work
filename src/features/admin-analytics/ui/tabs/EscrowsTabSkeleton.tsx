import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DashboardCard,
  DashboardCardSeparator,
} from "@/components/dashboard/dashboard-card";

const ChartRegionSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("w-full rounded-lg", className)} />
);

export const EscrowsTabSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-1 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <DashboardCard key={index}>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-8 w-20" />
          <Skeleton className="mt-2 h-3 w-32" />
        </DashboardCard>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[.68fr_.32fr] xl:grid-cols-[.70fr_.30fr]">
      <DashboardCard className="gap-4">
        <Skeleton className="h-4 w-36" />
        <ChartRegionSkeleton className="aspect-16/5 w-full" />
      </DashboardCard>

      <div className="relative flex flex-col gap-4">
        <DashboardCardSeparator
          className="absolute inset-y-0 -left-2 hidden h-full w-px lg:block"
          orientation="vertical"
        />
        <DashboardCardSeparator className="block lg:hidden" />
        <DashboardCard className="gap-4">
          <Skeleton className="h-4 w-40" />
          <ChartRegionSkeleton className="aspect-square max-h-72 w-full" />
        </DashboardCard>
        <DashboardCard className="gap-2">
          <Skeleton className="h-3 w-48" />
        </DashboardCard>
      </div>
    </div>
  </div>
);
