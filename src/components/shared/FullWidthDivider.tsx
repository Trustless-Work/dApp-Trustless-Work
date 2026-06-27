import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type FullWidthDividerProps = ComponentProps<"div"> & {
  contained?: boolean;
  position?: "top" | "bottom";
};

export const FullWidthDivider = ({
  className,
  contained = false,
  position,
  ...props
}: FullWidthDividerProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute h-px bg-border",
        contained ? "inset-x-0 w-full" : "left-1/2 w-screen -translate-x-1/2",
        position === "top" && "-top-px",
        position === "bottom" && "-bottom-px",
        className,
      )}
      {...props}
    />
  );
};
