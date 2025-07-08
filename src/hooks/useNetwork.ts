"use client";

import { useState, useEffect } from "react";

export type NetworkType = "testnet" | "mainnet";

const useNetwork = () => {
  const [network, setNetwork] = useState<NetworkType>("testnet");
  const [isReseting, setIsReseting] = useState(false);

  useEffect(() => {
    const savedNetwork = localStorage.getItem("network") as NetworkType;
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  const changeNetwork = (newNetwork: NetworkType) => {
    if (newNetwork === network) return;

    setIsReseting(true);
    setNetwork(newNetwork);
    localStorage.setItem("network", newNetwork);

    setTimeout(() => {
      setIsReseting(false);
      window.location.reload();
    }, 500);
  };

  return {
    currentNetwork: network,
    changeNetwork,
    isReseting,
  };
};

export default useNetwork;
