import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonEscrowVolumeTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-4 w-[140px] mt-1" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex flex-col justify-end space-y-2">
          <div className="flex items-end justify-between h-[220px] pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-[33%] rounded-t-sm mx-2"
                style={{ height: `${30 + (index % 3) * 40}px` }}
              />
            ))}
          </div>

          <Skeleton className="h-[1px] w-full" />

          <div className="flex justify-between w-full pt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-12" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
