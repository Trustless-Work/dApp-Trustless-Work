"use client";

import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useHeaderWithoutAuth = () => {
  const { address } = useGlobalAuthenticationStore();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  const handleRequestApiKey = () => {
    router.push("/request-api-key");
  };

  return { handleRequestApiKey, address };
};

export default useHeaderWithoutAuth;
