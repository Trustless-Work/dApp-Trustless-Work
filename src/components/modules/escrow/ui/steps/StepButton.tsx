import * as React from "react";
import { cn } from "@/lib/utils";

interface StepButtonProps {
  number: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const StepButton = React.memo(function StepButton({
  number,
  isActive,
  isCompleted,
  onClick,
}: StepButtonProps) {
  return (
    <button
      onClick={onClick}
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
        {number}
      </span>
    </button>
  );
});
