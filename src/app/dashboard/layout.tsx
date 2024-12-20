import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/modules/dashboard/Datepicker";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="bg-muted/50 min-h-screen">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
