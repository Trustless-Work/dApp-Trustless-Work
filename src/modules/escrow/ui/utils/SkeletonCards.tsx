import { Skeleton } from "@/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card";

const SkeletonCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden border border-border/40 min-h-[220px] flex flex-col justify-between"
        >
          <CardHeader className="p-4 pb-0 flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
            <div className="space-y-1.5 w-full sm:w-2/3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 mt-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <Skeleton className="h-3 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SkeletonCards;
