"use client";

import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const useHome = () => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();

  // Solo usar scroll animations si no es mobile
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    enabled: !shouldReduceMotion,
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Solo escuchar eventos si no es mobile
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!shouldReduceMotion) {
      // Solo procesar si no es mobile
    }
  });

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
