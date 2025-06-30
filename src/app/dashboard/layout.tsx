"use client";

import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import useLayoutDashboard from "@/hooks/layout-dashboard.hook";
import { redirect } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Lights } from "@/components/layout/all/ui/utils/Lights";
import { useTranslation } from "react-i18next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();
  const { label } = useLayoutDashboard();
  const { t } = useTranslation();

  // Normalize label: convert to lowercase, trim spaces, replace spaces with hyphens
  const normalizeLabel = (label: string): string => {
    if (!label) return "dashboard";
    return label.toLowerCase().trim().replace(/\s+/g, "-");
  };

  console.log(address);
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
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
            {label !== "Help" && label !== "Report Issue" && (
              <h2 className="text-3xl font-bold tracking-tight">
                {t("sidebar." + normalizeLabel(label))}
              </h2>
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
