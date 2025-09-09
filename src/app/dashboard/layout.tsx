"use client";

import AppSidebar from "@/shared/sidebar/AppSidebar";
import Footer from "@/shared/Footer";
import { SidebarInset, SidebarProvider } from "@/ui/sidebar";
import Header from "@/shared/Header";
import { redirect } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/store/data";
import { Lights } from "@/shared/utils/Lights";
import { MobileWalletBalance } from "@/modules/auth/mobile-wallet-balance";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  // Authentication check
  if (address === "") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <Lights />
      <AppSidebar />
      <SidebarInset>
        <Header />
        <MobileWalletBalance />
        <div className="min-h-screen">
          <div className="flex-1 space-y-4 p-4 md:px-8 h-full">{children}</div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
