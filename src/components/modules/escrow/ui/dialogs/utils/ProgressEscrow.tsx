import type { Escrow } from "@/@types/escrow.entity";
import { cn } from "@/lib/utils";

interface ProgressEscrowProps {
  escrow: Escrow;
  showTimeline?: boolean;
}

const ProgressCircle = ({
  percentage,
  color,
  size = 44,
  strokeWidth = 3,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(226, 232, 240, 0.3)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

const ProgressEscrow = ({
  escrow,
  showTimeline = false,
}: ProgressEscrowProps) => {
  const completedMilestones = escrow.milestones.filter(
    (milestone) => milestone.status === "completed",
  ).length;
  const approvedMilestones = escrow.milestones.filter(
    (milestone) => milestone.approved_flag === true,
  ).length;
  const totalMilestones = escrow.milestones.length;

  const progressPercentageCompleted =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const progressPercentageApproved =
    totalMilestones > 0 ? (approvedMilestones / totalMilestones) * 100 : 0;

  const shouldHideProgress = escrow.releaseFlag || escrow.resolvedFlag;

  if (shouldHideProgress || totalMilestones === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Summary circles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProgressCircle
            percentage={progressPercentageCompleted}
            color="#006be4"
          />
          <div className="text-xs">
            <div className="font-medium">Completed</div>
            <div className="text-muted-foreground">
              {completedMilestones}/{totalMilestones}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-right">
            <div className="font-medium">Approved</div>
            <div className="text-muted-foreground">
              {approvedMilestones}/{totalMilestones}
            </div>
          </div>
          <ProgressCircle
            percentage={progressPercentageApproved}
            color="#15803d"
          />
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div className="pt-1">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-0 right-0 h-0.5 bg-muted/30 top-[9px]"></div>
            <div
              className="absolute left-0 h-0.5 bg-primary top-[9px] transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentageCompleted}%` }}
            ></div>

            {/* Milestone dots */}
            <div className="flex justify-between relative py-1">
              {Array.from({ length: totalMilestones }).map((_, i) => {
                // Calculate position percentage for this milestone
                const position =
                  totalMilestones > 1 ? (i / (totalMilestones - 1)) * 100 : 0;

                return (
                  <div
                    key={i}
                    className="absolute top-0 flex flex-col items-center"
                    style={{
                      left: `${position}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className={cn(
                        "w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-300",
                        i < completedMilestones
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-muted/50 text-muted-foreground",
                      )}
                    >
                      {i < approvedMilestones ? (
                        <div className="w-[6px] h-[6px] rounded-full bg-indigo-200"></div>
                      ) : (
                        <span className="text-[9px]">{i + 1}</span>
                      )}
                    </div>

                    {/* Status indicator */}
                    <div className="mt-2 text-[10px] font-medium">
                      {i < completedMilestones && i < approvedMilestones ? (
                        <span className="text-green-700">Approved</span>
                      ) : i < completedMilestones ? (
                        <span className="text-primary">Completed</span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressEscrow;
