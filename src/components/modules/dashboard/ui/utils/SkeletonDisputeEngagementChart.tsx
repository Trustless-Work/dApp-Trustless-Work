import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDisputeEngagementChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Disputes by Engagement</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto aspect-square h-[200px] flex items-center justify-center">
          <div className="relative">
            <Skeleton className="h-[160px] w-[160px] rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Skeleton className="h-6 w-14 mb-1" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="py-2">
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-6 rounded" />
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
