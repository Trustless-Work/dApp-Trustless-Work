"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import HeaderWithoutAuth from "@/components/shared/HeaderWithoutAuth";
import Image from "next/image";
import { Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/WalletProvider";

export const LoginView = () => {
  const { handleConnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress } = useWalletContext();

  useEffect(() => {
    if (walletAddress && isLoading) {
      setIsLoading(false);
    }
  }, [walletAddress, isLoading]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await handleConnect();
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto relative">
      <HeaderWithoutAuth />

      <div className="flex flex-1 items-start my-0 md:my-20 justify-center py-8 sm:py-4 px-4 sm:px-2 md:px-0">
        <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-background/90 relative">
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
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 rounded-lg shadow-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold"
                aria-label="Login with Wallet"
              >
                {isLoading ? (
                  <Loader2
                    className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Wallet
                    className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 text-center sm:text-left">
                  {isLoading ? "Connecting..." : "Login with Wallet"}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Right: Logo (only on md+) */}
          <Card className="hidden md:flex rounded-none md:rounded-r-2xl w-[400px] lg:w-[440px] shrink-0 border-l-0 p-0">
            <div className="flex h-full w-full flex-1 items-center justify-center px-8 lg:px-14 py-8 lg:py-12">
              <Image
                src="/icon.png"
                alt="Trustless Work Logo"
                width={180}
                height={180}
                className="block drop-shadow-2xl dark:drop-shadow-none"
                priority
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
