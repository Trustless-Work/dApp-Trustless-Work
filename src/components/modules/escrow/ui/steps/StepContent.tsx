import * as React from "react";
import { cn } from "@/lib/utils";
import { StepItem } from "./EscrowStepper";

interface StepContentProps {
  step: StepItem;
  isActive: boolean;
}

export const StepContent = React.memo(function StepContent({
  step,
  isActive,
}: StepContentProps) {
  return (
    <div className="bg-muted rounded-lg px-6 py-4">
      <h3
        className={cn(
          "text-lg font-medium",
          isActive ? "text-blue-500" : "text-zinc-900 dark:text-zinc-200",
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
  );
});
