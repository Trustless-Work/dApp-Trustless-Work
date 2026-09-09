"use client";

import { Fragment, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import {
  ANALYTICS_TABS,
  DEFAULT_ANALYTICS_TAB,
  isAnalyticsTabId,
  type AnalyticsTabId,
} from "@/features/admin-analytics/constants/analytics-tabs";
import { AnalyticsRangeSelect } from "@/features/admin-analytics/ui/AnalyticsRangeSelect";

type AnalyticsTabsProps = {
  activeTab: AnalyticsTabId;
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
  growthContent: React.ReactNode;
  revenueContent: React.ReactNode;
  escrowsContent: React.ReactNode;
  apiKeysContent: React.ReactNode;
  filtersContent?: React.ReactNode;
};

const TABS_WITH_RANGE = new Set<AnalyticsTabId>([
  "growth",
  "revenue",
  "escrows",
  "api-keys",
]);

export const AnalyticsTabs = ({
  activeTab,
  range,
  onRangeChange,
  growthContent,
  revenueContent,
  escrowsContent,
  apiKeysContent,
  filtersContent,
}: AnalyticsTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = useCallback(
    (nextTab: string) => {
      if (!isAnalyticsTabId(nextTab)) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", nextTab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const contentByTab: Record<AnalyticsTabId, React.ReactNode> = {
    growth: growthContent,
    revenue: revenueContent,
    escrows: escrowsContent,
    "api-keys": apiKeysContent,
  };

  return (
    <Tabs className="gap-6" value={activeTab} onValueChange={handleTabChange}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList
          className={cn(
            "h-auto w-fit items-center gap-0 bg-transparent p-0",
            "group-data-horizontal/tabs:h-auto",
          )}
          variant="line"
        >
          {ANALYTICS_TABS.map((tab, index) => {
            const TabIcon = tab.icon;
            return (
            <Fragment key={tab.id}>
              {index > 0 ? (
                <Separator className="h-auto" orientation="vertical" />
              ) : null}
              <TabsTrigger
                className={cn(
                  "h-auto flex-none cursor-pointer rounded-none border-0 bg-transparent px-3 py-0 shadow-none",
                  "inline-flex items-center gap-2 text-base text-muted-foreground",
                  "hover:bg-transparent hover:text-foreground",
                  "data-active:bg-transparent data-active:font-semibold data-active:text-foreground data-active:shadow-none",
                  "after:hidden",
                )}
                value={tab.id}
              >
                <TabIcon aria-hidden="true" className="size-4 shrink-0" />
                {tab.label}
              </TabsTrigger>
            </Fragment>
            );
          })}
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          {filtersContent}
          {TABS_WITH_RANGE.has(activeTab) ? (
            <AnalyticsRangeSelect value={range} onChange={onRangeChange} />
          ) : null}
        </div>
      </div>

      {ANALYTICS_TABS.map((tab) => (
        <TabsContent
          key={tab.id}
          className="mt-0 data-[state=inactive]:hidden"
          value={tab.id}
        >
          {contentByTab[tab.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export function resolveAnalyticsTab(tabParam: string | null): AnalyticsTabId {
  return isAnalyticsTabId(tabParam) ? tabParam : DEFAULT_ANALYTICS_TAB;
}
