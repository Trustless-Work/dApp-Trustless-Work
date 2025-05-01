"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonMilestoneStatusChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="h-[240px] flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-3 w-3 mr-2 rounded-full" />
              <Skeleton className="h-3 w-[60px]" />
              <Skeleton className="h-3 w-[30px] ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
