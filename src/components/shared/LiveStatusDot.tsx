import { cn } from "@/lib/utils";

export type LiveStatusTone = "active" | "released" | "disputed";

const toneStyles: Record<
  LiveStatusTone,
  { readonly dot: string; readonly ping: string | null }
> = {
  active: {
    dot: "bg-background",
    ping: "bg-background",
  },
  released: {
    dot: "bg-muted-foreground",
    ping: null,
  },
  disputed: {
    dot: "bg-destructive",
    ping: null,
  },
};

type LiveStatusDotProps = {
  tone: LiveStatusTone;
  className?: string;
};

export const LiveStatusDot = ({ tone, className }: LiveStatusDotProps) => {
  const styles = toneStyles[tone];

  return (
    <span
      className={cn("relative flex size-2 shrink-0", className)}
      aria-hidden="true"
    >
      {styles.ping ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            styles.ping,
          )}
        />
      ) : null}
      <span
        className={cn("relative inline-flex size-2 rounded-full", styles.dot)}
      />
    </span>
  );
};
