import { Escrow } from "@/@types/escrow.entity";
import { Progress, ProgressTwo } from "@/components/ui/progress";

interface ProgressEscrowProps {
  escrow: Escrow;
}

const ProgressEscrow = ({ escrow }: ProgressEscrowProps) => {
  // todo: use these constants in zusntand
  const completedMilestones = escrow.milestones.filter(
    (milestone) => milestone.status === "completed",
  ).length;

  const approvedMilestones = escrow.milestones.filter(
    (milestone) => milestone.flag === true,
  ).length;

  const totalMilestones = escrow.milestones.length;

  const progressPercentageCompleted =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const progressPercentageApproved =
    totalMilestones > 0 ? (approvedMilestones / totalMilestones) * 100 : 0;

  // Check if both are 100% and releaseFlag is false
  const pendingRelease =
    progressPercentageCompleted === 100 &&
    progressPercentageApproved === 100 &&
    !escrow.releaseFlag &&
    !escrow.resolvedFlag;

  const isFinished =
    progressPercentageCompleted === 100 && progressPercentageApproved === 100;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex w-full justify-between">
        {(() => {
          if (!isFinished || pendingRelease) {
            return (
              <>
                <h3 className="mb-1 font-bold text-xs">Completed</h3>
                <h3 className="mb-1 font-bold text-xs">Approved</h3>
              </>
            );
          } else if (escrow.releaseFlag || escrow.resolvedFlag) {
            return <h3 className="mb-1 font-bold text-xs h-8" />;
          }
        })()}
      </div>
      <div className="flex items-center gap-2">
        {(() => {
          if (!isFinished || pendingRelease) {
            return (
              <>
                <strong className="text-xs">
                  {progressPercentageCompleted.toFixed(0)}%
                </strong>
                <Progress value={progressPercentageCompleted} />
                <ProgressTwo value={progressPercentageApproved} />
                <strong className="text-xs">
                  {progressPercentageApproved.toFixed(0)}%
                </strong>
              </>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default ProgressEscrow;
