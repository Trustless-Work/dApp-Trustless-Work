"use client";

import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const useHome = () => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [, setScrollY] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollY(latest);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return {
    containerRef,
    y1,
    opacity,
  };
};
