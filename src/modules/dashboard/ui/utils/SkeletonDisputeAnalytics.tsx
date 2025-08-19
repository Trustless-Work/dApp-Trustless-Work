import { Skeleton } from "@/ui/skeleton";

export function SkeletonDisputeAnalytics() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Skeleton className="h-8 w-48" /> {/* Title skeleton */}
      {/* Metrics Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
      {/* Charts and List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* First Card */}
        <div className="p-6 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Second Card */}
        <div className="p-6 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
