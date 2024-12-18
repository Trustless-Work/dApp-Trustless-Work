import { ReactNode } from "react";
import { Button } from "../button";
import { DateRangePicker } from "./Datepicker";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}