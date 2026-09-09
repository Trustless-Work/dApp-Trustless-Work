"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RevenueAssetAmount } from "@/features/admin-analytics/ui/RevenueAssetAmount";
import { formatOrganizationName } from "@/features/admin-analytics/utils/revenue.util";
import { formatRequestCount } from "@/features/admin-analytics/utils/api-keys.util";
import { UsageTrackedBanner } from "@/features/admin-analytics/ui/api-keys/ApiKeysSummaryStats";
import type { ApiKeyDetailResponse } from "@/features/admin-analytics/types/analytics-v2.types";

type ApiKeyDetailSheetProps = {
  open: boolean;
  isLoading: boolean;
  data: ApiKeyDetailResponse | undefined;
  usageTrackedSince: string | null;
  onOpenChange: (open: boolean) => void;
};

export const ApiKeyDetailSheet = ({
  open,
  isLoading,
  data,
  usageTrackedSince,
  onOpenChange,
}: ApiKeyDetailSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="overflow-y-auto sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>API key detail</SheetTitle>
      </SheetHeader>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : data ? (
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <p className="font-medium text-sm">
              {data.key.description ?? data.key.id}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatOrganizationName(data.organization)}
            </p>
            {data.attribution === "platform" ? (
              <Badge className="mt-2" variant="outline">
                Platform attribution
              </Badge>
            ) : null}
          </div>

          {data.escrowStats.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Platform escrow stats</p>
              {data.escrowStats.map((stat) => (
                <div
                  key={stat.asset.address}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">{stat.asset.symbol}</span>
                  <RevenueAssetAmount
                    align="right"
                    amount={stat.feeAmount}
                    asset={stat.asset}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {data.usage.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Daily requests</p>
              <UsageTrackedBanner since={usageTrackedSince} />
              {data.usage.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{day.day}</span>
                  <span className="tabular-nums">
                    {formatRequestCount(day.requestCount)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </SheetContent>
  </Sheet>
);
