import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NoDataProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const NoData = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: NoDataProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted">
        <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-foreground text-balance">
        {title}
      </h3>

      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}

      {actionLabel ? (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
