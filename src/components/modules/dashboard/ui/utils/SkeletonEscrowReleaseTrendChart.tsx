"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonEscrowReleaseTrendChart = () => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Escrow Release Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};
