import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PreferencesSectionSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
        <div className="flex min-w-0 items-start gap-3">
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-[18.4px] w-8 shrink-0 rounded-full" />
      </div>
    </CardContent>
  </Card>
);
