"use client";

import { useCallback, useRef, useState } from "react";

type LinkedAddressFieldProps = {
  highlighted: boolean;
  linkable: boolean;
  onLinkHoverStart: () => void;
  onLinkHoverEnd: () => void;
};

export function useLinkedAddressHighlight() {
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);
  const clearHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleLinkHoverStart = useCallback((address: string) => {
    if (clearHoverTimeoutRef.current) {
      clearTimeout(clearHoverTimeoutRef.current);
      clearHoverTimeoutRef.current = null;
    }

    setHoveredAddress(address);
  }, []);

  const handleLinkHoverEnd = useCallback(() => {
    clearHoverTimeoutRef.current = setTimeout(() => {
      setHoveredAddress(null);
      clearHoverTimeoutRef.current = null;
    }, 40);
  }, []);

  const getLinkedAddressProps = useCallback(
    (address: string, isShared: boolean): LinkedAddressFieldProps => ({
      highlighted: hoveredAddress === address,
      linkable: isShared,
      onLinkHoverStart: () => handleLinkHoverStart(address),
      onLinkHoverEnd: handleLinkHoverEnd,
    }),
    [handleLinkHoverEnd, handleLinkHoverStart, hoveredAddress],
  );

  return { getLinkedAddressProps };
}
