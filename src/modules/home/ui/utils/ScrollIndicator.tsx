"use client";

import { useShouldReduceMotion } from "@/hooks/useMobile";

export const ScrollIndicator = () => {
  const shouldReduceMotion = useShouldReduceMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-70">
      <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center pt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
    </div>
  );
};
