import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_LOCALE } from "./formater";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

/** Demo headline aligned with the block reference. */
const BUDGET_TOTAL_USD = 50_734;

const SEGMENTS = [
	{
		pct: 50,
		label: "Unused",
		color: "var(--chart-2)",
	},
	{
		pct: 25,
		label: "Used",
		color: "var(--chart-3)",
	},
	{
		pct: 25,
		label: "Reserved",
		color: "var(--chart-4)",
	},
] as const;

function formatUsdWhole(value: number) {
	return new Intl.NumberFormat(DASHBOARD_LOCALE, {
		currency: "USD",
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
		style: "currency",
	}).format(value);
}

export function BudgetUsage() {
	return (
		<DashboardCard className="flex-1 gap-6">
			<div className="flex items-start justify-between">
				<div className="flex min-w-0 flex-col gap-1">
					<DashboardCardTitle>Budget usage</DashboardCardTitle>
					<span className="text-balance font-semibold text-2xl tabular-nums">
						{formatUsdWhole(BUDGET_TOTAL_USD)}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button className="text-muted-foreground" size="sm" variant="ghost">
						<Layers aria-hidden="true" data-icon="inline-start" strokeWidth={2} />
						Manage Budget
					</Button>
				</div>
			</div>

			<div className="flex gap-1">
				{SEGMENTS.map((s) => (
					<div
						className="flex min-w-0 flex-col gap-1"
						key={s.label}
						style={{ flex: `${s.pct} 1 0%` }}
					>
						<div className="flex flex-col gap-1">
							<span className="text-muted-foreground text-xs tabular-nums">
								{s.pct}%
							</span>
							<div
								aria-hidden="true"
								className="h-4 w-px shrink-0 bg-muted-foreground/35"
							/>
						</div>
						<div
							className={cn("rounded-xl h-4 w-full min-w-0")}
							style={{ backgroundColor: s.color }}
						/>
					</div>
				))}
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{SEGMENTS.map((s) => (
					<div className="flex items-center gap-2" key={s.label}>
						<span
							aria-hidden="true"
							className={cn("size-2 shrink-0 rounded-full")}
							style={{ backgroundColor: s.color }}
						/>
						<span className="text-muted-foreground text-xs">{s.label}</span>
					</div>
				))}
			</div>
		</DashboardCard>
	);
}
