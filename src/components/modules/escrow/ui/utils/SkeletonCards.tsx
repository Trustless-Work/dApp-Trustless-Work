import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 mb-2">
          <Skeleton className="h-44 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full md:w-2/4" />
            <Skeleton className="h-4 w-full md:w-2/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCards;
