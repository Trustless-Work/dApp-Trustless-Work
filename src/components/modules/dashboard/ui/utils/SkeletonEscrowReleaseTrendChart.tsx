"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export const SkeletonEscrowReleaseTrendChart = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>{t("dashboard.general.releaseTrend.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};
