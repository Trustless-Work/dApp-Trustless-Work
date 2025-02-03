import { Skeleton } from "@/components/ui/skeleton";

const SkeletonFundEscrow = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full my-2" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonFundEscrow;
