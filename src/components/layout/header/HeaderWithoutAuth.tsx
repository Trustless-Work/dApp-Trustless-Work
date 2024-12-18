"use client";

import { useWalletUtils } from "@/utils/hook/wallet.hook";
import useHeaderWithoutAuth from "./hooks/header-without-auth.hook";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";

const HeaderWithoutAuth = () => {
  const { handleConnect, handleDisconnect } = useWalletUtils();
  const { address, handleReportIssue, handleRequestApiKey } =
    useHeaderWithoutAuth();

  return (
    <div className="flex w-full justify-between items-center gap-2 px-4">
      <Link href="/">
        <Image src="/logo.png" alt="Trustless Work" width={80} height={80} />
      </Link>
      {address ? (
        <>
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
            onClick={handleReportIssue}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-500 to-red-700 group-hover:from-red-600 group-hover:to-red-800 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Report Issue
            </span>
          </button>

          <button
            type="button"
            onClick={handleRequestApiKey}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Request an API Key
            </span>
          </button>

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
  );
};

export default HeaderWithoutAuth;
