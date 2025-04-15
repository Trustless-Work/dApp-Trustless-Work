"use client";

import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import useLayoutDashboard from "@/hooks/layout-dashboard.hook";
import { redirect } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/core/store/data";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();
  const { label } = useLayoutDashboard();

  // Authentication check
  if (address === "") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="min-h-screen">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
            {label !== "Help" && label !== "Report Issue" && (
              <h2 className="text-3xl font-bold tracking-tight">{label}</h2>
            )}
            {children}
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
