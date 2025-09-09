"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { enUS, es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Calendar } from "./calendar";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parseInitialRange = (): DateRange | undefined => {
    const raw = searchParams.get("dateRange");
    if (!raw) return;

    const parseYMD = (s: string): Date | undefined => {
      const parts = s.split("-");
      if (parts.length !== 3) return undefined;
      const [yy, mm, dd] = parts.map((p) => Number(p));
      if (!yy || !mm || !dd) return undefined;
      const d = new Date(yy, mm - 1, dd);
      return isNaN(d.getTime()) ? undefined : d;
    };

    const [s1, s2] = raw.split("_");
    let start = parseYMD(s1);
    let end = s2 ? parseYMD(s2) : undefined;

    // Fallback: handle legacy ISO strings
    if (!start) {
      const d = new Date(s1);
      if (!isNaN(d.getTime())) start = d;
    }
    if (!end && s2) {
      const d = new Date(s2);
      if (!isNaN(d.getTime())) end = d;
    }

    if (!start) return;
    return { from: start, to: end };
  };

  const [date, setDate] = React.useState<DateRange | undefined>(
    parseInitialRange,
  );

  // Keep internal state in sync with URL changes (e.g., when clearing filters)
  React.useEffect(() => {
    setDate(parseInitialRange());
  }, [searchParams]);

  const updateURL = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(
      "dateRange",
      `${format(range.from, "yyyy-MM-dd")}_${format(range.to, "yyyy-MM-dd")}`,
    );
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{t("common.pickDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            locale={i18n.language === "es" ? es : enUS}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              updateURL(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
