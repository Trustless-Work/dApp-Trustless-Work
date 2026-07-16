"use client";

import dynamic from "next/dynamic";
import { DashboardSkeleton } from "@/features/dashboard/ui/dashboard-skeleton";
import { TrustlessWorkProvider } from "@/providers/TrustlessWorkProvider";

const DashboardContent = dynamic(
  () =>
    import("@/features/dashboard/ui/DashboardContent").then((mod) => ({
      default: mod.DashboardContent,
    })),
  {
    loading: () => <DashboardSkeleton />,
  },
);

export const DashboardView = () => {
  return (
    <TrustlessWorkProvider>
      <DashboardContent />
    </TrustlessWorkProvider>
  );
};
