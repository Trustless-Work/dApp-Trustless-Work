"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientStorage, getStoredNetwork } from "@/lib/client-storage";
import type { NetworkType } from "@/types/network.entity";

const useNetwork = () => {
  const [network, setNetwork] = useState<NetworkType>("testnet");
  const [isReseting, setIsReseting] = useState(false);

  useEffect(() => {
    setNetwork(getStoredNetwork());
  }, []);

  const changeNetwork = useCallback((newNetwork: NetworkType) => {
    if (newNetwork === getStoredNetwork()) {
      return;
    }

    setIsReseting(true);
    setNetwork(newNetwork);
    getClientStorage().setItem("network", newNetwork);

    setTimeout(() => {
      setIsReseting(false);
      window.location.reload();
    }, 500);
  }, []);

  return { currentNetwork: network, changeNetwork, isReseting };
};

export default useNetwork;
