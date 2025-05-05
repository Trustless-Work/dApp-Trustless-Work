"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Escrow } from "@/@types/escrow.entity";
import { TopEscrowsTable } from "../tables/TopEscrowsTable";
import { SkeletonTopEscrowsTable } from "../utils/SkeletonTopEscrowsTable";

type TopEscrowsListProps = {
  escrows: Escrow[];
};

export const TopEscrowsList = ({ escrows }: TopEscrowsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Recents Escrows</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto px-5">
        {escrows ? (
          <TopEscrowsTable escrows={escrows} />
        ) : (
          <SkeletonTopEscrowsTable />
        )}
      </CardContent>
    </Card>
  );
};
