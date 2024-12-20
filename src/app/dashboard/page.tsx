import { DashboardLayout } from "@/components/ui/dashboard/dashboardLayout";
import { MetricsSection } from "@/components/ui/dashboard/MetricSection";
import { RecentSales } from "@/components/ui/dashboard/RecentSales";
import { Chart } from "@/components/ui/dashboard/chart";
import Progress from "@/components/ui/dashboard/Progress";

export default function Page() {
  const chartData = [
    { name: "Jan", value: 4500 },
    { name: "Feb", value: 4000 },
    { name: "Mar", value: 6000 },
    { name: "Apr", value: 2000 },
    { name: "May", value: 3000 },
    { name: "Jun", value: 4000 },
    { name: "Jul", value: 3500 },
    { name: "Aug", value: 4200 },
    { name: "Sep", value: 4000 },
    { name: "Oct", value: 3200 },
    { name: "Nov", value: 3000 },
    { name: "Dec", value: 2800 },
  ];

  return (
    <div className="flex flex-col">
      <div className="space-y-4">
        <MetricsSection />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Chart
              title="Overview"
              data={chartData}
            />
          </div>
          <div className="col-span-4 lg:col-span-3">
            <RecentSales />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Progress value={50} label="Progress" />
          </div>
        </div>
      </div>
    </div>
  );
}
