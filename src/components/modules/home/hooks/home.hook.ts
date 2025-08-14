"use client";

import { useRef } from "react";

export const useHome = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  return {
    containerRef,
    y1: 0,
    opacity: 1,
  } as const;
};
