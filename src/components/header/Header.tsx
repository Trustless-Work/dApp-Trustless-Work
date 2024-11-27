"use client";

import { useWalletStore } from "@/store/walletStore";
import { useWallet } from "@/wallet/hooks/useWallet.hook";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ItemsHeader from "./ItemsHeader";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { connectWallet, disconnectWallet } = useWallet();
  const { address, name } = useWalletStore();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      console.log("Address copied to clipboard");
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
            <HoverCard>
              <HoverCardTrigger>
                <FaUserCircle size={30} />
              </HoverCardTrigger>
              <HoverCardContent className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center translate-y-[50px]">
                <p className="text-base">
                  {address && name + " - " + formatAddress(address)}
                </p>
                <button
                  onClick={copyAddress}
                  className="p-2.5 text-white hover:text-black active:text-black focus:text-black"
                >
                  Copy Address
                </button>
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
