"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useStepsStore } from "@/store/stepsStore/store";

export interface StepItem {
  title: string;
  description?: string;
  component: React.ReactNode;
}

export interface EscrowStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[];
}

export const EscrowStepper = React.forwardRef<HTMLDivElement, EscrowStepperProps>(
  ({ items, className, ...props }, ref) => {
    const { currentStep, setCurrentStep, toggleStep, isStepCompleted } =
      useStepsStore();

    React.useEffect(() => {
      setCurrentStep(items.length);
    }, [items.length, setCurrentStep]);

    const handleStepToggle = (stepNumber: number) => {
      toggleStep(stepNumber);
    };

    return (
      <div className={cn("grid grid-cols-[300px_1fr] gap-6", className)} {...props}>
        <div className="space-y-4">
          {items.map((step: StepItem, index: number) => {
            const stepNumber: number = index + 1;
            const isActive: boolean = stepNumber === currentStep;
            const isCompleted: boolean = isStepCompleted(stepNumber);

            return (
              <div
                key={index}
                className={cn(
                  "relative flex items-start gap-3",
                  "before:absolute before:left-5 before:top-[2.9rem] before:h-[calc(100%-2rem)] before:w-[2px]",
                  isCompleted
                    ? "before:bg-blue-500"
                    : "before:bg-zinc-200 dark:before:bg-zinc-800",
                  index === items.length - 1 ? "before:hidden" : "",
                )}
              >
                <button
                  onClick={() => handleStepToggle(stepNumber)}
                  className={cn(
                    "relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors z-10",
                    isCompleted
                      ? "border-blue-500 bg-blue-500"
                      : "border-zinc-200 dark:border-zinc-800",
                    isActive ? "border-blue-500" : "",
                    "hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCompleted
                        ? "text-white"
                        : isActive
                          ? "text-blue-500"
                          : "text-zinc-500 dark:text-zinc-400",
                    )}
                  >
                    {stepNumber}
                  </span>
                </button>

                <div className="flex-1">
                  <div className="bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg px-6 py-4">
                    <h3
                      className={cn(
                        "text-lg font-medium",
                        isActive
                          ? "text-blue-500"
                          : "text-zinc-900 dark:text-zinc-200",
                      )}
                    >
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-500">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="min-h-[300px] bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg p-6">
          {items[currentStep - 1]?.component}
        </div>
      </div>
    );
  },
);

EscrowStepper.displayName = "EscrowStepper";

