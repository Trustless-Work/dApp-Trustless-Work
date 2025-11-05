"use client";

import AppSidebar from "@/shared/sidebar/AppSidebar";
import Footer from "@/shared/Footer";
import { SidebarInset, SidebarProvider } from "@/ui/sidebar";
import Header from "@/shared/Header";
import { redirect } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/store/data";
import { Lights } from "@/shared/utils/Lights";
import { EscrowProvider } from "@/tw-blocks/providers/EscrowProvider";
import { EscrowAmountProvider } from "@/tw-blocks/providers/EscrowAmountProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  // Authentication check
  if (address === "") {
    redirect("/");
  }

  return (
    <EscrowProvider>
      <EscrowAmountProvider>
        <SidebarProvider>
          <Lights />
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="min-h-screen">
              <div className="flex-1 space-y-4 p-4 md:px-8 h-full">
                {children}
              </div>
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </EscrowAmountProvider>
    </EscrowProvider>
  );
};

export default Layout;
