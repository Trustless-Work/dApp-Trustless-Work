"use client";

import { useWallet } from "@/modules/auth/hooks/useWallet";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import useHeaderWithoutAuth from "@/hooks/useHeaderWithoutAuth";
import useScrollHeader from "@/hooks/useScrollHeader";
import ThemeToggle from "./utils/ThemeToggle";

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
          ? "bg-background/10 backdrop-blur-md shadow-sm p-3 px-10 rounded-b-3xl"
          : "bg-background",
      )}
    >
      <Link href="/">
        <Image src="/logo.png" alt="Trustless Work" width={80} height={80} />
      </Link>
      <div className="flex gap-5 ml-auto">
        {/* <LanguageToggle /> */}
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
