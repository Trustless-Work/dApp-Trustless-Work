import { AppSidebar } from "@/components/ui/app-sidebar";
import { Footer } from "@/components/shared/Footer";
import { Lights } from "@/components/shared/Lights";
import { Navbar } from "@/components/shared/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardLayoutProps = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<SidebarProvider defaultOpen={false} className="block min-h-svh md:flex">
			<Lights />
			<AppSidebar />
			<SidebarInset className="min-h-svh">
				<Navbar />

				<div className="flex min-h-[calc(100svh-3.5rem)] flex-1 flex-col gap-4 p-4 md:min-h-[calc(100svh-4rem)] md:px-8">
					{children}
				</div>

				<Footer containedDividers />
			</SidebarInset>
		</SidebarProvider>
	);
}
