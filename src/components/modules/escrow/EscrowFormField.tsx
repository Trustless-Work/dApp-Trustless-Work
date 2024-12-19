import React from "react";
import { CiCircleInfo } from "react-icons/ci";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipInfoProps {
  content: string;
}

export function TooltipInfo({ content }: TooltipInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <CiCircleInfo className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">More information</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
