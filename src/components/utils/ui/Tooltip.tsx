import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TooltipInfoProps {
  content: string;
  children?: React.ReactNode;
}

const TooltipInfo = ({ content, children }: TooltipInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children ? (
            children
          ) : (
            <span className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
              <Info className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">More information</span>
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent className="border border-black/50 dark:border-white/30 rounded-md shadow-md p-2">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
