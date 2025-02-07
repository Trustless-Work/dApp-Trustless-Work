import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonEditMilestones = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col ms-center gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {[...Array(3)].map((_, index) => (
            <div key={index}>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              {index === 2 && (
                <Skeleton className="h-10 w-full md:w-1/4 mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Skeleton className="h-10 w-32" />
      </DialogFooter>
    </div>
  );
};

export default SkeletonEditMilestones;
