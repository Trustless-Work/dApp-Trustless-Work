import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPendingDisputes() {
  return (
    <div className="space-y-1.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-2.5 rounded-lg border bg-card">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full mt-1.5" />
        </div>
      ))}
    </div>
  );
}
