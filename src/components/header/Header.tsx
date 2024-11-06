"use client";

import { useWalletStore } from "@/store/walletStore";
import { useWallet } from "@/wallet/hooks/useWallet.hook";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ItemsHeader from "./ItemsHeader";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { connectWallet, disconnectWallet } = useWallet();
  const { address, name } = useWalletStore();

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

  return (
    <header className="flex flex-col md:flex-row w-full justify-between gap-5 container mx-auto">
      <Link href="/" className="mx-auto md:m-0">
        {" "}
        <Image src="/logo.png" width={100} height={100} alt="logo" />
      </Link>

      {/* Navigation Menu */}
      <ItemsHeader isEnabled={address} />

      {/* Wallet and Theme Toggle */}
      <div className="flex mx-auto md:m-0 items-center gap-5">
        <ThemeToggle />
        {address ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <FaUserCircle size={30} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-base">
                    {address && name + " - " + address}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
