"use client";

import { cn } from "@/lib/utils";
import { NotificationBell } from "@/modules/notifications/NotificationBell";
import NetworkToggle from "./utils/NetworkToggle";
import useHeader from "@/hooks/useHeader";
import useScrollHeader from "@/hooks/useScrollHeader";
import { Breadcrumb, BreadcrumbList } from "@/ui/breadcrumb";
import ThemeToggle from "./utils/ThemeToggle";
import { Wallet } from "./Wallet";
import { SidebarTrigger } from "@/ui/sidebar";

const Header = ({ className }: { className?: string }) => {
  const { pathName, getBreadCrumbs, address } = useHeader();
  const { isScrolled } = useScrollHeader();

  return (
    <header
      className={cn(
        "flex flex-1 h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-in-out group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4",
        isScrolled && "sticky top-0 z-50",
        isScrolled
          ? "bg-background/60 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 px-4">
        {pathName !== "/" && address ? (
          <>
            <div className="flex w-full items-center justify-between md:w-auto">
              <SidebarTrigger className="h-10 w-10 md:hidden" />
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>{getBreadCrumbs()}</BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex gap-3 ml-auto items-center">
              <NetworkToggle />
              {/* <LanguageToggle /> */}
              <ThemeToggle />
              <NotificationBell />
            </div>
          </>
        ) : (
          <div className="flex gap-3 ml-auto md:ml-0">
            <NetworkToggle />
            {/* <LanguageToggle /> */}
            <ThemeToggle />
          </div>
        )}

        <Wallet />
      </div>
    </header>
  );
};

export default Header;
