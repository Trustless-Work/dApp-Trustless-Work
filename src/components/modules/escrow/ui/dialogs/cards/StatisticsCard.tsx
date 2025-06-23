"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Badge } from "@/components/ui/badge";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface StatisticsCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  value: ReactNode;
  subValue?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconSize?: number;
  tooltipContent?: string;
  fundedBy?: string;
}

export const StatisticsCard = ({
  title,
  icon: Icon,
  iconColor,
  value,
  subValue,
  actionLabel,
  onAction,
  className,
  iconSize = 30,
  tooltipContent,
  fundedBy,
}: StatisticsCardProps) => {
  const { formatText } = useFormatUtils();

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-lg w-full",
        className,
      )}
    >
      <CardContent className="py-4 px-8 min-h-20">
        <div className="flex items-center justify-between">
          <div className="flex">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {tooltipContent && <TooltipInfo content={tooltipContent} />}
          </div>

          <Icon className={iconColor} size={iconSize} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <h3 className="text-2xl font-semibold">{value}</h3>
            {subValue}
          </div>
          {fundedBy && (
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground uppercase"
            >
              Funded by {formatText(fundedBy)}
            </Badge>
          )}
          {actionLabel && onAction && (
            <Button
              variant="link"
              type="button"
              onClick={onAction}
              className="text-xs text-muted-foreground my-0 p-0 h-auto"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
