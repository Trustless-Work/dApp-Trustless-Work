import { cn } from "@/lib/utils";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <div
      className={cn(
        shouldReduceMotion
          ? "rounded-md bg-black/5 dark:bg-white/5"
          : "animate-pulse rounded-md bg-black/5 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
