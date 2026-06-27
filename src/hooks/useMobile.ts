import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function subscribeToMobile(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getMobileServerSnapshot() {
  return false;
}

const useIsMobile = () => {
  return useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getMobileServerSnapshot,
  );
};

function subscribeToReduceMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  window.addEventListener("resize", callback);
  return () => {
    mql.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

function getReduceMotionSnapshot() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const isLowEndDevice = navigator.hardwareConcurrency <= 4;

  return prefersReducedMotion || isMobile || isLowEndDevice;
}

function getReduceMotionServerSnapshot() {
  return false;
}

export const useShouldReduceMotion = () => {
  return useSyncExternalStore(
    subscribeToReduceMotion,
    getReduceMotionSnapshot,
    getReduceMotionServerSnapshot,
  );
};

export const useThrottledScroll = (
  callback: (scrollY: number) => void,
  delay: number = 16,
) => {
  const isMobile = useIsMobile();

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (scrollY: number) => {
      if (timeoutIdRef.current) return;

      timeoutIdRef.current = setTimeout(
        () => {
          if (Math.abs(scrollY - lastScrollYRef.current) > 5) {
            callbackRef.current(scrollY);
            lastScrollYRef.current = scrollY;
          }
          timeoutIdRef.current = null;
        },
        isMobile ? delay * 2 : delay,
      );
    },
    [delay, isMobile],
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
