import { useWalletStore } from "@/store/walletStore";
import React from "react";

export const useCopyUtils = () => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const { address } = useWalletStore();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return { copyAddress, setCopySuccess, copySuccess };
};
