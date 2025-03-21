"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StatusBreakdownChart } from "./StatusBreakdownChart";
import { StatusBreakdownTable } from "./StatusBreakdownTable";
import { TopEscrowsTable } from "./TopEscrowsTable";
import { EscrowTrendsChart } from "./EscrowTrendsChart";
import { EscrowVolumeChart } from "./EscrowVolumeChart";
import { useEscrowDashboardSection } from "@/hooks/use-escrow-section.hook";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

export function EscrowSection() {
  const [useMockData, setUseMockData] = useState(true);
  const { isLoading, error, refreshData } = useEscrowDashboardSection({
    useMockData,
  }) as { isLoading: boolean; error: Error | null; refreshData: () => void };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Escrow Breakdown</h2>
        <Button
          onClick={() => refreshData()}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <ErrorState message={(error as Error).message} />}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escrow Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState />
            ) : (
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <StatusBreakdownChart />
                </TabsContent>
                <TabsContent value="table">
                  <StatusBreakdownTable />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escrow Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <LoadingState /> : <EscrowVolumeChart />}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Active Escrows by Value</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingState /> : <TopEscrowsTable />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escrow Release Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingState /> : <EscrowTrendsChart />}
        </CardContent>
        {!isLoading && (
          <CardFooter className="text-xs text-gray-500 flex justify-end">
            Last updated: {new Date().toLocaleTimeString()}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
