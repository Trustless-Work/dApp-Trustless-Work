"use client";

import { useWalletStore } from "@/store/walletStore/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useHeaderWithoutAuth = () => {
  const { address } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  const handleRequestApiKey = () => {
    router.push("/request-api-key");
  };

  const handleReportIssue = () => {
    router.push("/report-issue");
  };

  return { handleRequestApiKey, handleReportIssue, address };
};

export default useHeaderWithoutAuth;
