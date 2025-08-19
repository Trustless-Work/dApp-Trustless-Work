"use client";

import { Card, CardContent, CardHeader } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";

export function SkeletonMilestoneApprovalTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
