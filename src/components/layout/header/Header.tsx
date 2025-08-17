"use client";

import ThemeToggle from "./ThemeToggle";
import { Breadcrumb, BreadcrumbList } from "../../ui/breadcrumb";
import { SidebarTrigger } from "../../ui/sidebar";
import useIsMobile from "@/hooks/mobile.hook";
import { cn } from "@/lib/utils";
import useHeader from "./hooks/header.hook";
import useScrollHeader from "./hooks/useScrollHeader.hook";
import { LogIn, LogOut } from "lucide-react";
import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/modules/notifications/NotificationBell";
import NetworkToggle from "./NetworkToggle";
import { ResponsiveWalletBalance } from "@/components/modules/auth/wallet/responsive-balance";

const Header = ({ className }: { className?: string }) => {
  const { handleConnect, handleDisconnect } = useWallet();
  const isMobile = useIsMobile();
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
      <div className="flex w-full justify-between items-center gap-2 px-4">
        {pathName !== "/" && address ? (
          <>
            <>
              <SidebarTrigger
                className={cn(
                  "h-10 w-10 z-0",
                  isMobile ? "absolute left-0" : "relative",
                )}
              />

              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>{getBreadCrumbs()}</BreadcrumbList>
              </Breadcrumb>
            </>

            <div className="flex gap-3 ml-auto items-center">
              <ResponsiveWalletBalance variant="desktop" />
              <NetworkToggle />
              {/* <LanguageToggle /> */}
              <ThemeToggle />
              <NotificationBell />
              <Button variant="outline" onClick={handleDisconnect}>
                <LogOut /> <span className="hidden md:block">Disconnect</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-3 ml-auto md:ml-0">
            <NetworkToggle />
            {/* <LanguageToggle /> */}
            <ThemeToggle />
            <Button variant="outline" onClick={handleConnect}>
              <LogIn /> <span className="hidden md:block">Connect</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
