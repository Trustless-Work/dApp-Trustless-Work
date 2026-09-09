import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardCard,
  DashboardCardTitle,
} from "@/components/dashboard/dashboard-card";

export const ApiKeysTabSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-16 w-full rounded-lg" />
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-xl border p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-xl border p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
    <DashboardCard className="gap-4">
      <DashboardCardTitle>Top API keys</DashboardCardTitle>
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border p-4">
            <Skeleton className="mb-2 h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="mb-2 h-10 w-full" />
        ))}
      </div>
    </DashboardCard>
  </div>
);
