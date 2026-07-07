import { Skeleton } from "@/components/ui/skeleton";

const EscrowCardSkeleton = () => (
  <article className="flex h-[22rem] flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-5 w-3/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>

    <div className="mt-2 space-y-1.5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>

    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </article>
);

export const EscrowsGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <EscrowCardSkeleton key={index} />
    ))}
  </div>
);
