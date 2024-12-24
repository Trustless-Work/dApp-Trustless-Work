import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipInfoProps {
  content: string;
}

const TooltipInfo = ({ content }: TooltipInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
            <IoInformationCircleOutline
              className="h-5 w-5"
              aria-hidden="true"
            />
            <span className="sr-only">More information</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
