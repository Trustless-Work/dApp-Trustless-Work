"use client";

import ThemeToggle from "./ThemeToggle";
import { Breadcrumb, BreadcrumbList } from "../../ui/breadcrumb";
import { SidebarTrigger } from "../../ui/sidebar";
import useIsMobile from "@/hooks/mobile.hook";
import { cn } from "@/lib/utils";
import useHeader from "./hooks/header.hook";
import Link from "next/link";
import { ArrowBigLeft, LogIn, LogOut } from "lucide-react";
import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/modules/notifications/NotificationBell"; // 👈 Asegúrate que la ruta sea correcta
import LanguageToggle from "./LanguageToggle";

const Header = ({ className }: { className?: string }) => {
  const { handleConnect, handleDisconnect } = useWallet();
  const isMobile = useIsMobile();
  const { pathName, getBreadCrumbs, address } = useHeader();

  return (
    <header
      className={cn(
        "flex flex-1 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4",
        className,
      )}
    >
      <div className="flex w-full justify-between items-center gap-2 px-4">
        {pathName !== "/" && address ? (
          <>
            {pathName !== "/settings" ? (
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
            ) : (
              <Link
                href={"/dashboard"}
                className="flex items-center gap-2 text-sm font-bold border-2 border-gray-200 dark:border-gray-600 rounded-md p-2"
              >
                <ArrowBigLeft />
                Back
              </Link>
            )}

            <div className="flex gap-5 ml-auto items-center">
              <LanguageToggle />
              <ThemeToggle />
              <NotificationBell />
              <Button variant="outline" onClick={handleDisconnect}>
                <LogOut /> Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-5 ml-auto">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="outline" onClick={handleConnect}>
              <LogIn /> Connect
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
