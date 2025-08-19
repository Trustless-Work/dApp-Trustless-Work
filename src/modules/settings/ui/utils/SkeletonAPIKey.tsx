import { Skeleton } from "@/ui/skeleton";

const SkeletonAPIKey = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-12 w-14 rounded-lg" />
      <Skeleton className="h-12 w-14 rounded-sm" />
    </div>
  );
};

export default SkeletonAPIKey;
