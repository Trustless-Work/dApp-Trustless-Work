"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREATE_ESCROW_STEPS } from "@/features/escrows/constants/create-escrow.constants";

type CreateEscrowStepIndicatorProps = {
  currentStep: number;
};

export const CreateEscrowStepIndicator = ({
  currentStep,
}: CreateEscrowStepIndicatorProps) => {
  return (
    <nav aria-label="Create escrow progress" className="w-full">
      <ol className="flex items-start">
        {CREATE_ESCROW_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === CREATE_ESCROW_STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn("flex min-w-0 items-start", !isLast && "flex-1")}
            >
              <div className="flex min-w-0 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground shadow-sm",
                    isActive &&
                      "border-primary bg-primary/10 text-primary shadow-[0_0_0_4px] shadow-primary/15",
                    !isCompleted &&
                      !isActive &&
                      "border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-4" aria-hidden />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="hidden min-w-0 px-1 text-center sm:block">
                  <p
                    className={cn(
                      "truncate text-xs font-semibold",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {!isLast ? (
                <div
                  aria-hidden
                  className={cn(
                    "mx-2 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
