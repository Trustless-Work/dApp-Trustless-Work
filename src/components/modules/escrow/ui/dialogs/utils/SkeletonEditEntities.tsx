import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonEditEntities = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button disabled>
          <Skeleton className="h-4 w-16" />
        </Button>
      </DialogFooter>
    </div>
  );
};
