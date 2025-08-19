"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { useTranslation } from "react-i18next";

export const SkeletonEscrowStatusChart = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("dashboard.general.status.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center gap-4 w-full flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-6 rounded" />
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
