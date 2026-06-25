import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-4 p-px md:grid-cols-4",
				"*:min-h-42 *:w-full *:rounded-lg *:bg-muted *:ring-1 *:ring-border *:dark:bg-muted/50"
			)}
		>
			<div />
			<div />
			<div />
			<div />
			<div className="col-span-2 min-h-80! md:col-span-3" />
			<div className="col-span-2 min-h-80! md:col-span-1" />
			<div className="col-span-2 min-h-100! md:col-span-1" />
			<div className="col-span-2 min-h-100! md:col-span-3" />
		</div>
	);
}
