import { cn } from "@/lib/utils";
import { Card, CardContent } from "../../../../ui/card";
import { SkeletonMetricCard } from "../utils/SkeletonMetricCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subValue?: string | React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const MetricCard = ({
  title,
  value,
  icon,
  subValue,
  className,
  isLoading = false,
}: MetricCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        {isLoading ? (
          <SkeletonMetricCard />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {icon && <div className="text-muted-foreground">{icon}</div>}
            </div>
            <div className="mt-2 flex items-baseline">
              <h3 className="text-2xl font-semibold">{value}</h3>
            </div>
            {subValue && (
              <p className="mt-2 text-sm text-muted-foreground">{subValue}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
