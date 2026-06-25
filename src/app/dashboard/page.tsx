import { AppSidebar } from "@/components/ui/app-sidebar";
import { Lights } from "@/components/shared/Lights";
import { Navbar } from "@/components/shared/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <SidebarProvider defaultOpen={false} className="block min-h-svh md:flex">
      <Lights />
      <AppSidebar />
      <SidebarInset>
        <Navbar />

        <div className="flex flex-1 flex-col gap-4 p-4 md:px-8">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
