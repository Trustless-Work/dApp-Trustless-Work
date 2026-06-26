"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import useScrollHeader from "@/hooks/useScrollHeader";
import { ToggleTheme } from "./ToggleTheme";
import { useAuth } from "@/providers/AuthProvider";
import { useSignOut } from "@/features/auth/hooks/useSignOut";

const HeaderWithoutAuth: React.FC = () => {
  const { signOut, isSigningOut } = useSignOut({ redirectTo: "/" });
  const { isAuthenticated } = useAuth();
  const { isScrolled } = useScrollHeader();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <div
      className={cn(
        "flex w-full justify-between items-center gap-2 px-4 transition-all duration-300 ease-in-out mt-5",
        isScrolled && "sticky top-0 z-50",
        isScrolled
          ? "bg-background/10 backdrop-blur-md shadow-sm p-3 px-10 rounded-b-3xl"
          : "bg-background",
      )}
    >
      <Link href="/">
        <Image src="/icon.png" alt="Trustless Work" width={50} height={50} />
      </Link>

      <div className="flex items-center gap-3 sm:gap-5 ml-auto">
        <ToggleTheme />

        {!isLoginPage && (
          <>
            {isAuthenticated ? (
              <Button
                variant="outline"
                disabled={isSigningOut}
                onClick={() => {
                  void signOut();
                }}
              >
                <LogOut /> Sign out
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
