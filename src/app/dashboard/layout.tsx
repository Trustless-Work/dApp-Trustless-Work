"use client";

import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import CreateButton from "@/components/utils/Create";
import useLayoutDashboard from "@/hooks/use-layout-dashboard";
import { redirect } from "next/navigation";
import { useWalletStore } from "@/store/walletStore/store";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useWalletStore();
  const { label } = useLayoutDashboard();

  if (address === "") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="bg-muted/50 min-h-screen">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
            <h2 className="text-3xl font-bold tracking-tight">{label}</h2>
            {children}
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
