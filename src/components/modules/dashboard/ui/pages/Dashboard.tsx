// src/components/modules/dashboard/ui/pages/Dashboard.tsx
"use client";

import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowDashboardData } from "../../hooks/use-escrow-dashboard-data.hook";
import { EscrowStatusChart } from "../charts/EscrowStatusChart";
import { EscrowReleaseTrendChart } from "../charts/EscrowReleaseTrendChart";
import { EscrowVolumeTrendChart } from "../charts/EscrowVolumeTrendChart";
import { TopEscrowsList } from "../lists/TopEscrowsList";
import Loader from "@/components/utils/ui/Loader";

export default function Dashboard() {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const data = useEscrowDashboardData({ address });

  if (!data) {
    return <Loader isLoading={true} />;
  }

  const { statusCounts, releaseTrend, volumeTrend, top5ByValue } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Escrow Dashboard</h1>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EscrowStatusChart data={statusCounts} />
        <EscrowReleaseTrendChart data={releaseTrend} />
        <EscrowVolumeTrendChart data={volumeTrend} />
        <TopEscrowsList data={top5ByValue} />
      </section>
    </div>
  );
}
