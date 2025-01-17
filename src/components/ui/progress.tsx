"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

const ProgressTwo = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value1: number;
    value2: number;
  }
>(({ className, value1, value2, ...props }, ref) => {
  const totalValue = Math.min(value1 + value2, 100);
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className,
      )}
      {...props}
    >
      <div
        className="absolute h-full bg-blue-500 transition-all"
        style={{ width: `${value1}%` }}
      />
      <div
        className="absolute h-full bg-green-500 transition-all"
        style={{
          width: `${value2}%`,
          left: `${value1}%`,
        }}
      />
      <div
        className="absolute h-full bg-gray-300 transition-all"
        style={{
          width: `${100 - totalValue}%`,
          left: `${totalValue}%`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, ProgressTwo };
