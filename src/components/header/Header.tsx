"use client";

import { useWalletStore } from "@/store/walletStore";
import { useWallet } from "@/wallet/hooks/useWallet.hook";
import { FaUserCircle, FaRegCopy } from "react-icons/fa";
import { LuWallet} from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import ItemsHeader from "./ItemsHeader";
import ThemeToggle from "./ThemeToggle";

// Enhanced HoverCard Components
const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

const Header = () => {
  const { connectWallet, disconnectWallet } = useWallet();
  const { address, name } = useWalletStore();
  const [copySuccess, setCopySuccess] = React.useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (disconnectWallet) {
        await disconnectWallet();
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const formatAddress = (address: string): string => {
    if (!address) return "";
    const start = address.slice(0, 8);
    const end = address.slice(-8);
    return `${start}....${end}`;
  };

  // Format the current date
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="flex flex-col md:flex-row w-full justify-between gap-5 container mx-auto">
      <Link href="/" className="mx-auto md:m-0">
        <Image src="/logo.png" width={100} height={100} alt="logo" />
      </Link>

      <ItemsHeader isEnabled={address} />

      <div className="flex mx-auto md:m-0 items-center gap-5">
        <ThemeToggle />
        {address ? (
          <>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <FaUserCircle size={30} />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex items-start space-x-4">
                  <LuWallet  size={40} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{name}</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        {formatAddress(address)}
                      </p>
                      <button
                        onClick={copyAddress}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title="Copy address"
                      >
                        <FaRegCopy
                          className={cn(
                            "h-4 w-4",
                            copySuccess
                              ? "text-green-500"
                              : "text-muted-foreground",
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{formatDate()}</span>
                    </div>
                    {copySuccess && (
                      <p className="text-xs text-green-500">Address copied!</p>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <button
              type="button"
              onClick={handleDisconnect}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center"
          >
            Connect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
