"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { StatusBreakdownChart } from "./StatusBreakdownChart";
import { StatusBreakdownTable } from "./StatusBreakdownTable";
import { TopEscrowsTable } from "./TopEscrowsTable";
import { EscrowTrendsChart } from "./EscrowTrendsChart";
import { EscrowVolumeChart } from "./EscrowVolumnChart";
import { useEscrowDashboardSection } from "@/hooks/use-escrow-section.hook";

export function EscrowSection() {
  const [useMockData, setUseMockData] = useState(true);
  const { isLoading, error, refreshData } = useEscrowDashboardSection({
    useMockData,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Escrow Breakdown</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escrow Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escrow Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <EscrowVolumeChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Active Escrows by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <TopEscrowsTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escrow Release Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <EscrowTrendsChart />
        </CardContent>
      </Card>
    </div>
  );
}
