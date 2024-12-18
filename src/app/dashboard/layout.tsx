import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-col gap-4 p-4 pt-0 min-h-screen">
          {/* Este contenedor crece dinámicamente con el contenido */}
          <div className="flex flex-1 flex-col rounded-xl bg-muted/50 p-5">
            {children}
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
