"use client";

import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import { redirect } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Lights } from "@/components/layout/all/ui/utils/Lights";

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
        <div className="min-h-screen">
          <div className="flex-1 space-y-4 p-4 md:px-8 h-full">{children}</div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
