import { cn } from "@/lib/utils";
import { MessageCircle, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./dashboard-card";

/**
 * Minimal “headline sentence” insight: one block of copy with an inline KPI,
 * inspired by monochrome dashboard callouts that read like product narrative.
 */
export function BudgetSentenceInsight({ className }: { className?: string }) {
  /** Demo delta (same spirit as reference: “…improved by 3.5%…”). */
  const upliftPct = 3.5;
  const upliftLabel = upliftPct >= 0 ? "improved" : "narrowed";

  return (
    <DashboardCard
      className={cn("h-full min-h-0 min-w-0 flex-1 gap-6 ps-6", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-medium text-sm">
          <PieChart className="size-4" strokeWidth={2} />
          AI Insights
        </div>
        <div className="flex items-center gap-2">
          <Button className="text-muted-foreground" size="sm" variant="ghost">
            <MessageCircle
              aria-hidden="true"
              data-icon="inline-start"
              strokeWidth={2}
            />
            Ask AI
          </Button>
        </div>
      </div>

      <p
        className={cn(
          "text-pretty text-left text-base text-muted-foreground tracking-wide",
          "md:max-w-86 md:text-lg xl:text-2xl",
        )}
      >
        Unused budget runway {upliftLabel} by{" "}
        <span className="font-medium text-foreground">
          {Math.abs(upliftPct)}% this month
        </span>{" "}
        vs. trailing burn.
      </p>
    </DashboardCard>
  );
}
