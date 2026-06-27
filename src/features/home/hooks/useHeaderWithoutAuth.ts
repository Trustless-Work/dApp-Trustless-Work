"use client";

import { useWalletContext } from "@/providers/WalletProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useHeaderWithoutAuth = () => {
  const { walletAddress } = useWalletContext();
  const router = useRouter();

  useEffect(() => {
    if (walletAddress) {
      router.push("/dashboard");
    }
  }, [walletAddress, router]);

  const handleRequestApiKey = () => {
    router.push("/request-api-key");
  };

  return { handleRequestApiKey };
};

export default useHeaderWithoutAuth;
