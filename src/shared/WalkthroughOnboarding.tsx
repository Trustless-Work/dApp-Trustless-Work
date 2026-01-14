"use client";

import { useEffect } from "react";
import { Walkthrough } from "@/shared/Walkthrough";
import { steps } from "@/constants/walkthrough.constant";
import { useGlobalAuthenticationStore } from "@/store/data";

export function WalkthroughOnboarding() {
  const shouldShow = useGlobalAuthenticationStore(
    (state) => state.shouldShowWalkthrough,
  );
  const hideWalkthrough = useGlobalAuthenticationStore(
    (state) => state.hideWalkthrough,
  );

  useEffect(() => {
    if (!shouldShow) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md p-4 flex items-center justify-center">
      <Walkthrough
        steps={steps}
        onComplete={hideWalkthrough}
        onSkip={hideWalkthrough}
        showSkip
      />
    </div>
  );
}
