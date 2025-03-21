import { Chart } from "@/components/ui/chart";
import MetricsSection from "../cards/MetricSection";
import RecentSales from "../cards/RecentSales";
import DateRangePicker from "../utils/Datepicker";
import { EscrowSection } from "../cards/EscrowSection";

const Dashboard = () => {
  // Mock Data
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
      <div className="flex w-full items-center justify-end mb-3">
        <DateRangePicker />
      </div>

      <div className="space-y-4">
        <MetricsSection />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Chart title="Overview" data={chartData} />
          </div>
          <div className="col-span-4 lg:col-span-3">
            <RecentSales />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <EscrowSection />
      </div>
    </div>
  );
};

export default Dashboard;
