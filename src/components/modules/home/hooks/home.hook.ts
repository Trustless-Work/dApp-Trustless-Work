"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const useHome = () => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    // enabled: !shouldReduceMotion,
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return {
    containerRef,
    y1: shouldReduceMotion ? { get: () => 0 } : y1,
    opacity: shouldReduceMotion ? { get: () => 1 } : opacity,
  };
};
