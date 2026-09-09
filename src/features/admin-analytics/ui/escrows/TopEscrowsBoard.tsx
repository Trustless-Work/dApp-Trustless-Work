"use client";

import Link from "next/link";
import { TrophyIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoData } from "@/components/shared/NoData";
import {
  DashboardCard,
  DashboardCardTitle,
} from "@/components/dashboard/dashboard-card";
import useNetwork from "@/hooks/useNetwork";
import { formatIsoDateTime } from "@/helpers/format.helper";
import { getTrustlessWorkViewerUrl } from "@/helpers/escrow-explorer.helper";
import type { EscrowsTopBy } from "@/features/admin-analytics/types/analytics-v2.types";
import { useEscrowsTop } from "@/features/admin-analytics/hooks/useAdminAnalytics";
import type { AnalyticsRange } from "@/features/admin-analytics/constants/analytics-range";
import { RevenueAssetAmount } from "@/features/admin-analytics/ui/RevenueAssetAmount";
import { formatOrganizationName, resolveAssetSymbol } from "@/features/admin-analytics/utils/revenue.util";
import { truncateId } from "@/features/admin-analytics/ui/revenue/RevenueEventRow";

type TopEscrowsBoardProps = {
  range: AnalyticsRange;
  by: EscrowsTopBy;
};

export const TopEscrowsBoard = ({ range, by }: TopEscrowsBoardProps) => {
  const { currentNetwork } = useNetwork();
  const query = useEscrowsTop(range, by);

  if (query.isPending) {
    return null;
  }

  const boards = query.data?.data ?? [];

  return (
    <DashboardCard className="gap-4">
      <DashboardCardTitle>Top escrows</DashboardCardTitle>
      <p className="text-muted-foreground text-xs">
        {by === "amount"
          ? "Live escrows only, ranked by funded value."
          : "Revenue population (includes removed escrows), ranked by fees earned."}
      </p>

      {boards.length === 0 ? (
        <NoData
          icon={TrophyIcon}
          title="No top escrows"
          description="No escrows match the selected range."
        />
      ) : (
        boards.map((board) => (
          <div key={board.asset.address} className="flex flex-col gap-3">
            <h3 className="font-medium text-sm">
              {resolveAssetSymbol(board.asset)}
              {!board.asset.resolved ? " *" : ""}
            </h3>

            <div className="flex flex-col gap-3 md:hidden">
              {board.escrows.map((escrow) => (
                <Card key={escrow.escrowId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="font-mono text-sm">
                      <Link
                        className="text-primary hover:underline"
                        href={getTrustlessWorkViewerUrl(
                          currentNetwork,
                          escrow.escrowId,
                        )}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {truncateId(escrow.escrowId)}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Organization
                      </span>
                      <p className="text-sm">
                        {formatOrganizationName(escrow.organization)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Fee</span>
                      {escrow.feeAmount ? (
                        <RevenueAssetAmount
                          amount={escrow.feeAmount}
                          asset={board.asset}
                        />
                      ) : (
                        <p className="text-sm">—</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escrow</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {board.escrows.map((escrow) => (
                    <TableRow key={escrow.escrowId}>
                      <TableCell className="font-mono text-xs">
                        <Link
                          className="text-primary hover:underline"
                          href={getTrustlessWorkViewerUrl(
                            currentNetwork,
                            escrow.escrowId,
                          )}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {truncateId(escrow.escrowId)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {formatOrganizationName(escrow.organization)}
                      </TableCell>
                      <TableCell>
                        {escrow.status ? (
                          <Badge variant="outline">{escrow.status}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {escrow.createdAt
                          ? formatIsoDateTime(escrow.createdAt)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {escrow.feeAmount ? (
                          <RevenueAssetAmount
                            align="right"
                            amount={escrow.feeAmount}
                            asset={board.asset}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </DashboardCard>
  );
};
