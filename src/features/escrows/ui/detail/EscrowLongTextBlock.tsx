"use client";

import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type EscrowLongTextBlockProps = {
  label: string;
  value: string;
  className?: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const EscrowLongTextBlock = ({
  label,
  value,
  className,
}: EscrowLongTextBlockProps) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      {isHttpUrl(trimmed) ? (
        <Link
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {trimmed}
          <ExternalLinkIcon className="size-3.5 shrink-0" />
        </Link>
      ) : (
        <ScrollArea className="max-h-56 rounded-2xl border border-border bg-muted/30">
          <p className="whitespace-pre-wrap break-words p-3 text-sm font-medium leading-relaxed">
            {trimmed}
          </p>
        </ScrollArea>
      )}
    </div>
  );
};
