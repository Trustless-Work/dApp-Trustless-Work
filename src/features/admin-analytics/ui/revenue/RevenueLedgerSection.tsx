"use client";

import {
  DashboardCard,
  DashboardCardSeparator,
  DashboardCardTitle,
} from "@/components/dashboard/dashboard-card";
import { RevenueEventsTable } from "@/features/admin-analytics/ui/RevenueEventsTable";
import type { RevenueEvent } from "@/features/admin-analytics/types/analytics.types";

type RevenueLedgerSectionProps = {
  events: readonly RevenueEvent[];
  total: number;
  escrowTotal: number;
  limit: number;
  offset: number;
  isLoading: boolean;
  errorMessage: string | null;
  onPageChange: (offset: number) => void;
};

export const RevenueLedgerSection = ({
  events,
  total,
  escrowTotal,
  limit,
  offset,
  isLoading,
  errorMessage,
  onPageChange,
}: RevenueLedgerSectionProps) => (
  <>
    <DashboardCardSeparator />
    <DashboardCard className="gap-4">
      <DashboardCardTitle>Revenue ledger</DashboardCardTitle>
      {errorMessage ? (
        <p className="text-pretty text-muted-foreground text-sm">
          {errorMessage}
        </p>
      ) : null}
      <p className="text-muted-foreground text-xs">
        Dimmed rows are audit history — only attributing rows count toward
        revenue totals.
      </p>
      <RevenueEventsTable
        escrowTotal={escrowTotal}
        events={events}
        isLoading={isLoading}
        limit={limit}
        offset={offset}
        total={total}
        onPageChange={onPageChange}
      />
    </DashboardCard>
  </>
);
