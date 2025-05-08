import { Milestone } from "@/@types/escrows/escrow.entity";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalBoundedStore } from "@/core/store/data";

const SkeletonMilestones = () => {
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const milestones = selectedEscrow?.milestones || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="ml-2 w-6 h-6 rounded-full" />
      </div>
      {milestones.map((_: Milestone, index: number) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
      ))}

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex w-full justify-between">
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-4 rounded-md" />
          <Skeleton className="flex-1 h-4 rounded-md" />
          <Skeleton className="flex-1 h-4 rounded-md" />
          <Skeleton className="w-6 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonMilestones;
