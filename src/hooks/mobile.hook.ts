import { useEffect, useState, useCallback } from "react";

const MOBILE_BREAKPOINT = 768;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
};

export const useShouldReduceMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detectar preferencias de usuario
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Detectar si es mobile
    const isMobile = window.innerWidth < 768;

    // Detectar si es dispositivo de gama baja
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;

    setShouldReduceMotion(prefersReducedMotion || isMobile || isLowEndDevice);
  }, []);

  return shouldReduceMotion;
};

export const useThrottledScroll = (
  callback: (scrollY: number) => void,
  delay: number = 16,
) => {
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  const throttledCallback = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;
      let lastScrollY = 0;

      return (scrollY: number) => {
        if (timeoutId) return;

        timeoutId = setTimeout(
          () => {
            if (Math.abs(scrollY - lastScrollY) > 5) {
              callback(scrollY);
              lastScrollY = scrollY;
            }
            timeoutId = null;
          },
          isMobile ? delay * 2 : delay,
        );
      };
    })(),
    [callback, delay, isMobile],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      throttledCallback(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [throttledCallback]);

  return throttledCallback;
};

export default useIsMobile;
