import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonResolveDispute = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col ms-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-32" />{" "}
            <Skeleton className="h-6 w-6 rounded-full" />{" "}
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-48" />{" "}
            <Skeleton className="h-6 w-6 rounded-full" />{" "}
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <DialogFooter>
        <Skeleton className="h-10 w-48" />{" "}
      </DialogFooter>
    </div>
  );
};

export default SkeletonResolveDispute;
