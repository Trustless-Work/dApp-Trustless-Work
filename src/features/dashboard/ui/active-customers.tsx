import { cn } from "@/lib/utils";
import { formatInteger, formatPercent } from "./formater";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

const TOTAL_CUSTOMERS = 2540;
/** Share of paying customers (demo); free = remainder. */
const PAID_SHARE = 1980 / TOTAL_CUSTOMERS;
const LINE_COUNT = 64;

type CustomerVariant = "paid" | "free";

const CUSTOMER_VARIANTS: Record<
  CustomerVariant,
  { label: string; color: string }
> = {
  paid: {
    label: "Paid",
    color: "bg-chart-2",
  },
  free: {
    label: "Free",
    color: "bg-chart-2/35",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function CustomerMixTick({
  variant,
  isLead,
}: {
  variant: CustomerVariant;
  isLead?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-w-0 flex-1 items-end justify-center",
        isLead && "h-[250%]",
      )}
    >
      <div
        className={cn(
          "h-full w-0.5 shrink-0 rounded-full",
          CUSTOMER_VARIANTS[variant].color,
        )}
      />
    </div>
  );
}

export function ActiveCustomers() {
  const paidCount = Math.round(TOTAL_CUSTOMERS * PAID_SHARE);
  const freeCount = TOTAL_CUSTOMERS - paidCount;
  const paidPercent = PAID_SHARE * 100;
  const freePercent = 100 - paidPercent;

  const paidLines = clamp(
    Math.round(LINE_COUNT * PAID_SHARE),
    1,
    LINE_COUNT - 1,
  );
  const freeLines = LINE_COUNT - paidLines;
  const paidBoundaryPercent = (paidLines / LINE_COUNT) * 100;

  const mixTicks = [
    ...Array.from({ length: paidLines }, (_, index) => ({
      id: `paid-${index}`,
      variant: "paid" as const,
      isLead: index === 0,
    })),
    ...Array.from({ length: freeLines }, (_, index) => ({
      id: `free-${index}`,
      variant: "free" as const,
      isLead: false,
    })),
  ];

  const summary = `${formatInteger(paidCount)} paid (${formatPercent(paidPercent, 1)}), ${formatInteger(freeCount)} free (${formatPercent(freePercent, 1)})`;

  return (
    <DashboardCard className="gap-0">
      <div className="-mb-2 flex flex-col gap-0.5 ps-3">
        <DashboardCardTitle>Active customers</DashboardCardTitle>
        <p className="text-balance font-semibold text-2xl text-foreground tabular-nums tracking-tight">
          {formatInteger(TOTAL_CUSTOMERS)}
        </p>
      </div>

      <p className="sr-only">
        Active customers {formatInteger(TOTAL_CUSTOMERS)}. {summary}
      </p>

      <div className="relative pt-5">
        {paidPercent > 40 ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2"
            style={{ left: `${paidBoundaryPercent}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium text-foreground text-xs tabular-nums">
                {formatPercent(paidPercent, 0)}
              </span>
              <div className="h-1 w-px shrink-0 bg-muted-foreground/35" />
            </div>
          </div>
        ) : null}
        <div
          aria-hidden="true"
          className="flex h-7 w-full min-w-0 items-end gap-px"
        >
          {mixTicks.map((tick) => (
            <CustomerMixTick
              isLead={tick.isLead}
              key={tick.id}
              variant={tick.variant}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {(Object.keys(CUSTOMER_VARIANTS) as CustomerVariant[]).map(
          (variant) => (
            <span
              className="flex cursor-default items-center gap-2 text-muted-foreground underline decoration-muted-foreground/70 decoration-dotted underline-offset-4"
              key={variant}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  CUSTOMER_VARIANTS[variant].color,
                )}
              />
              {CUSTOMER_VARIANTS[variant].label}
            </span>
          ),
        )}
      </div>
    </DashboardCard>
  );
}
