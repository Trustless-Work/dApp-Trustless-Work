import { cn } from "@/lib/utils";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFullCurrency, formatPercent } from "./formater";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

/** Demo headline for the total revenue gauge and subscription split. */
const TOTAL_REVENUE = 284_920;

/**
 * Demo split — recurring subscription revenue vs usage/services (SaaS-style story).
 * Gauge fill follows subscription share.
 */
const SUBSCRIPTION_REVENUE = 207_994;
const SUBSCRIPTION_SHARE = SUBSCRIPTION_REVENUE / TOTAL_REVENUE;

const GAUGE_SEGMENTS = 52;
const GAUGE_PROGRESS = SUBSCRIPTION_SHARE;

/** viewBox units — arc opens downward like the reference (apex toward top of SVG). */
const VB = { w: 240, h: 200 };
const CX = 120;
const CY = 118;
/** Mid-radius where tick centers sit (no shared pivot → no center blob). */
const R_MID = 92;
const TICK_HALF = 10;
const STROKE = 4.5;

type RevenueSplitVariant = "subscriptions" | "usage";

const REVENUE_SPLIT: Record<
  RevenueSplitVariant,
  { label: string; color: string; opacity?: number }
> = {
  subscriptions: {
    label: "Subscriptions",
    color: "var(--chart-2)",
  },
  usage: {
    label: "Usage & services",
    color: "var(--chart-2)",
    opacity: 0.35,
  },
};

function angleDegForSegment(index: number) {
  const denom = Math.max(1, GAUGE_SEGMENTS - 1);
  return -135 + (index / denom) * 270;
}

function tickLine(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const r1 = R_MID - TICK_HALF;
  const r2 = R_MID + TICK_HALF;
  return {
    x1: CX + r1 * sin,
    y1: CY - r1 * cos,
    x2: CX + r2 * sin,
    y2: CY - r2 * cos,
  };
}

function RevenueRadialGauge({
  progress,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress));
  const filledCount = Math.round(clamped * GAUGE_SEGMENTS);

  return (
    <div
      aria-hidden
      className={cn("relative isolate mx-auto size-full max-w-80", className)}
      style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
      {...props}
    >
      <svg
        className="inset-0 size-full overflow-visible"
        viewBox={`0 0 ${VB.w} ${VB.h}`}
      >
        {Array.from({ length: GAUGE_SEGMENTS }).map((_, index) => {
          const angle = angleDegForSegment(index);
          const active = index < filledCount;
          const split = active
            ? REVENUE_SPLIT.subscriptions
            : REVENUE_SPLIT.usage;
          const { x1, y1, x2, y2 } = tickLine(angle);

          return (
            <line
              key={`gauge-${angle.toFixed(5)}`}
              stroke={split.color}
              strokeLinecap="round"
              strokeOpacity={split.opacity ?? 1}
              strokeWidth={STROKE}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 top-1/6 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function TotalRevenue() {
  const gaugeLabel = `Subscription revenue share ${formatPercent(SUBSCRIPTION_SHARE * 100, 1)}`;

  return (
    <DashboardCard className="gap-4">
      <div className="sr-only">{gaugeLabel}</div>

      <RevenueRadialGauge progress={GAUGE_PROGRESS}>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground [&>svg]:size-4",
          )}
        >
          <Wallet aria-hidden="true" strokeWidth={2} />
        </div>
        <div className="relative z-10 mt-2 flex w-full flex-col items-center">
          <DashboardCardTitle>Total Revenue</DashboardCardTitle>
          <span className="text-balance text-center font-medium text-foreground text-sm tabular-nums tracking-tight">
            {formatFullCurrency(TOTAL_REVENUE)}
          </span>
        </div>
      </RevenueRadialGauge>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {(Object.keys(REVENUE_SPLIT) as RevenueSplitVariant[]).map(
          (variant) => (
            <span
              className="flex cursor-default items-center gap-2 text-muted-foreground underline decoration-muted-foreground/70 decoration-dotted underline-offset-4"
              key={variant}
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: REVENUE_SPLIT[variant].color,
                  opacity: REVENUE_SPLIT[variant].opacity ?? 1,
                }}
              />
              {REVENUE_SPLIT[variant].label}
            </span>
          ),
        )}
      </div>

      <Button className="w-full" size="sm" variant="secondary">
        View Detail
        <ArrowRight aria-hidden="true" data-icon="inline-end" strokeWidth={2} />
      </Button>
    </DashboardCard>
  );
}
