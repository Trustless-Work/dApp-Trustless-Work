"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import Image from "next/image";
import { Wallet, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "../../../wallet/hooks/wallet.hook";

export const Login = () => {
  const { handleConnect } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithoutAuth />
      <div className="flex flex-1 items-start my-0 md:my-20 justify-center py-8 sm:py-4 px-4 sm:px-2 md:px-0">
        <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-background/90">
          {/* Left: Welcome + Buttons */}
          <Card className="flex-1 rounded-none md:rounded-l-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 border-r-0">
            <CardHeader className="px-0 pt-0 pb-6 sm:pb-8">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center md:text-left">
                Welcome to <span className="text-primary">Trustless Work</span>
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-center md:text-left mt-2 sm:mt-4">
                Sign in to continue to your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:gap-6 px-0 pt-0">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleConnect}
                className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 rounded-lg shadow-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold"
                aria-label="Login with Wallet"
              >
                <Wallet
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                  aria-hidden="true"
                />
                <span className="flex-1 text-center sm:text-left">
                  Login with Wallet
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 rounded-lg shadow-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold"
                aria-label="Login with Passkey"
              >
                <Fingerprint
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                  aria-hidden="true"
                />
                <span className="flex-1 text-center sm:text-left">
                  Login with Passkey
                </span>
              </Button>
            </CardContent>
          </Card>
          {/* Right: Logo (only on md+) */}
          <Card className="hidden md:flex rounded-none md:rounded-r-2xl flex-col items-center justify-center px-8 lg:px-14 py-8 lg:py-12 w-[400px] lg:w-[440px] border-l-0">
            <Image
              src="/logo.png"
              alt="Trustless Work Logo"
              width={180}
              height={180}
              className="mb-2 drop-shadow-2xl dark:drop-shadow-none"
              priority
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
