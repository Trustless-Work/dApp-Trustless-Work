"use client";

import ThemeToggle from "./ThemeToggle";
import { Breadcrumb, BreadcrumbList } from "../../ui/breadcrumb";
import { SidebarTrigger } from "../../ui/sidebar";
import useIsMobile from "@/hooks/mobile.hook";
import { cn } from "@/lib/utils";
import useHeader from "./hooks/header.hook";
import Link from "next/link";
import { ArrowBigLeft, CircleHelp } from "lucide-react";
import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";

const Header = () => {
  const { handleConnect, handleDisconnect } = useWallet();
  const isMobile = useIsMobile();
  const { pathName, getBreadCrumbs, address } = useHeader();

  return (
    <header className="flex flex-1 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4">
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

            <div className="flex gap-5 ml-auto">
              <ThemeToggle />

              <button
                type="button"
                onClick={handleDisconnect}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Disconnect
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-5 ml-auto">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleConnect}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Connect
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
