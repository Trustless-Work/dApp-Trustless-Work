import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDisputeAnalytics() {
  return (
    <div className="space-y-4">
      {/* Metrics Cards Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Pie Chart Section */}
      <div className="h-[250px] w-full flex items-center justify-center">
        <div className="relative">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
