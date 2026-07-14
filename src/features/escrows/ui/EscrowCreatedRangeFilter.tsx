"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type EscrowCreatedRangeFilterProps = {
  createdAfter: string;
  createdBefore: string;
  onChange: (range: { createdAfter: string; createdBefore: string }) => void;
};

function parseIsoDate(value: string): Date | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toStartOfDayIso(date: Date): string {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.toISOString();
}

function toEndOfDayIso(date: Date): string {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next.toISOString();
}

export const EscrowCreatedRangeFilter = ({
  createdAfter,
  createdBefore,
  onChange,
}: EscrowCreatedRangeFilterProps) => {
  const selected: DateRange | undefined = (() => {
    const from = parseIsoDate(createdAfter);
    const to = parseIsoDate(createdBefore);

    if (!from && !to) {
      return undefined;
    }

    return { from, to };
  })();

  const label =
    selected?.from && selected.to
      ? `${format(selected.from, "LLL dd, y")} – ${format(selected.to, "LLL dd, y")}`
      : selected?.from
        ? `${format(selected.from, "LLL dd, y")} – …`
        : "Pick a date range";

  return (
    <div className="space-y-1.5">
      <Label className="capitalize">Created Range</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 w-full justify-start rounded-4xl border-border bg-background text-left font-normal dark:bg-transparent dark:hover:bg-input/30",
              !selected?.from && "text-muted-foreground capitalize",
            )}
          >
            <CalendarIcon className="size-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={selected?.from}
            selected={selected}
            onSelect={(range) => {
              onChange({
                createdAfter: range?.from ? toStartOfDayIso(range.from) : "",
                createdBefore: range?.to
                  ? toEndOfDayIso(range.to)
                  : range?.from
                    ? toEndOfDayIso(range.from)
                    : "",
              });
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
