import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import Footer from "@/components/layout/footer/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header/Header";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/dashboard/Datepicker";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="bg-muted/50 min-h-screen">
          {/* Este contenedor crece dinámicamente con el contenido */}
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
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
