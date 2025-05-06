import { useCallback } from "react";

export function useInfoItem() {
  const truncateAddress = useCallback((address: string) => {
    if (!address || address.length <= 12) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
  }, []);

  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
  }, []);

  return {
    truncateAddress,
    copyToClipboard,
  };
}
