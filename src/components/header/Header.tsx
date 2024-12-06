"use client";

import { useWalletStore } from "@/store/walletStore";
import ThemeToggle from "./ThemeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useWalletUtils } from "@/utils/hook/wallet.hook";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const Header = () => {
  const { handleConnect, handleDisconnect } = useWalletUtils();
  const { address } = useWalletStore();
  const pathName = usePathname();
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (address) router.push("/dashboard");
    else router.push("/");
  }, []);

  return (
    <header className="flex flex-1 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4">
      <div className="flex w-full justify-between items-center gap-2 px-4">
        {pathName !== "/" && address ? (
          <>
            <SidebarTrigger
              className={cn(
                "h-10 w-10 z-0",
                isMobile ? "absolute left-0" : "relative",
              )}
            />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Example</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-5 ml-auto">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-5 ml-auto">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleConnect}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
