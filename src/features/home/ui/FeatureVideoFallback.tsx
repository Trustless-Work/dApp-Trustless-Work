"use client";

import { ReactNode } from "react";

type FeatureVideoFallbackProps = {
  icon: ReactNode;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
};

export const FeatureVideoFallback = ({
  icon,
  title,
  description,
  step,
  totalSteps,
}: FeatureVideoFallbackProps) => {
  return (
    <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 text-center sm:min-h-[320px]">
      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        Step {step} of {totalSteps}
      </span>

      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-background/80 shadow-sm backdrop-blur-sm [&_svg]:h-10 [&_svg]:w-10">
        {icon}
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};
