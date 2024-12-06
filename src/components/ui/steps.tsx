"use client";

import * as React from "react";
import { useStepsStore } from "@/store/stepsStore/store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  title: string;
  description?: string;
  component: React.ReactNode;
}

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[];
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ items, className, ...props }, ref) => {
    const { currentStep, setTotalSteps, toggleStep, isStepCompleted } =
      useStepsStore();

    const [progressStates, setProgressStates] = React.useState<number[]>(
      items.map(() => 0),
    );

    React.useEffect(() => {
      setTotalSteps(items.length);
    }, [items.length, setTotalSteps]);

    const handleStepToggle = (stepNumber: number) => {
      toggleStep(stepNumber);
      setProgressStates((prev) => {
        const newStates = [...prev];
        newStates[stepNumber - 1] = stepNumber;
        for (let i = stepNumber; i < newStates.length; i++) {
          newStates[i] = 0;
        }
        return newStates;
      });
    };

    return (
      <div className={cn("grid grid-cols-1 gap-6", className)} {...props}>
        <div className="space-y-4">
          {items.map((step: StepItem, index: number) => {
            const stepNumber: number = index + 1;
            const isActive: boolean = stepNumber === currentStep;
            const isCompleted: boolean = isStepCompleted(stepNumber);
            const currentProgress: number = progressStates[index];

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

                <div className="flex-1 flex items-start gap-6">
                  {/* Retroalimentation Cards */}
                  <div className="flex-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg px-6 py-4">
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

                  {/* Horizontal Steps */}
                  <div className="flex items-center pt-2">
                    {Array.from({ length: 5 }).map((_, nodeIndex: number) => {
                      const progressNumber: number = nodeIndex + 1;
                      const isProgressActive: boolean =
                        progressNumber <= currentProgress;

                      return (
                        <React.Fragment key={nodeIndex}>
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                              isProgressActive
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400",
                            )}
                          >
                            {isProgressActive ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              progressNumber
                            )}
                          </div>

                          {nodeIndex < 4 && (
                            <div className="relative w-12 h-0.5 bg-zinc-200 dark:bg-zinc-800">
                              <div
                                className="absolute inset-0 bg-blue-500 transition-all duration-300"
                                style={{
                                  width:
                                    progressNumber < currentProgress
                                      ? "100%"
                                      : "0%",
                                }}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">{items[currentStep - 1]?.component}</div>
      </div>
    );
  },
);

Steps.displayName = "Steps";
