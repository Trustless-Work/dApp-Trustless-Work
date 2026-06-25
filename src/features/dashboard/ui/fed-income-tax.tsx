import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DASHBOARD_LOCALE,
	formatFullCurrency,
	parseIsoCalendarDate,
} from "./formater";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

const TAX_PAYMENT_DATE_ISO = "2025-03-24";
const TAX_AMOUNT_USD = 1450;

function formatLongUsDate(isoDate: string) {
	const date = parseIsoCalendarDate(isoDate);
	return date.toLocaleDateString(DASHBOARD_LOCALE, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function DetailRow({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 text-sm">
			<span className="shrink-0 text-muted-foreground">{label}</span>
			<div className="min-w-0 text-right text-foreground">{children}</div>
		</div>
	);
}

export function FedIncomeTax() {
	return (
		<DashboardCard className="flex-1 gap-5">
			<DashboardCardTitle>Federal Income Tax</DashboardCardTitle>

			<div className="flex flex-col gap-3">
				<DetailRow label="Date:">
					<span className="tabular-nums">
						{formatLongUsDate(TAX_PAYMENT_DATE_ISO)}
					</span>
				</DetailRow>
				<DetailRow label="Amount:">
					<span className="tabular-nums">
						{formatFullCurrency(TAX_AMOUNT_USD)}
					</span>
				</DetailRow>
				<DetailRow label="Payment method:">
					<span className="inline-flex items-center justify-end gap-2 tabular-nums">
						<span>**** 4432</span>
					</span>
				</DetailRow>
				<DetailRow label="Status:">
					<Badge className="ml-auto" variant="secondary">
						Completed
					</Badge>
				</DetailRow>
			</div>

			<Button className="w-full" size="sm" variant="secondary">
				View Details
				<ArrowRight aria-hidden="true" data-icon="inline-end" strokeWidth={2} />
			</Button>
		</DashboardCard>
	);
}
