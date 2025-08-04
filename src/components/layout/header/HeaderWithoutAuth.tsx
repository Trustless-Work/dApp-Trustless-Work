"use client";

import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";
import useHeaderWithoutAuth from "./hooks/header-without-auth.hook";
import useScrollHeader from "./hooks/useScrollHeader.hook";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const HeaderWithoutAuth: React.FC = () => {
  const { handleDisconnect } = useWallet();
  const { address } = useHeaderWithoutAuth();
  const { isScrolled } = useScrollHeader();
  const { t } = useTranslation("common");
  const pathname = usePathname();

  // Don't show login/logout buttons on login page
  const isLoginPage = pathname === "/login";

  return (
    <div
      className={cn(
        "flex w-full justify-between items-center gap-2 px-4 transition-all duration-300 ease-in-out",
        isScrolled && "sticky top-0 z-50",
        isScrolled
          ? "bg-background/60 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background",
      )}
    >
      <Link href="/">
        <Image src="/logo.png" alt="Trustless Work" width={80} height={80} />
      </Link>
      <div className="flex gap-5 ml-auto">
        <LanguageToggle />
        <ThemeToggle />
        {!isLoginPage && (
          <>
            {address ? (
              <Button variant="outline" onClick={handleDisconnect}>
                <LogOut /> {t("header.disconnect")}
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline">
                  <LogIn /> Login
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderWithoutAuth;
