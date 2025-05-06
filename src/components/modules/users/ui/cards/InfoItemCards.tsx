"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  const { copiedKeyId, copyText } = useCopyUtils();
  const isAddress = label.toLowerCase() === "wallet";

  return (
    <div className="flex items-start gap-3 group">
      <div className="mt-0.5 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="flex flex-col w-full">
        <span className="font-medium text-sm text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-foreground truncate w-4/5">{value}</span>
          {isAddress && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => copyText(value, label)}
              title="Copy to clipboard"
            >
              <TooltipInfo content="Copy address">
                {copiedKeyId ? (
                  <Check size={15} className="text-green-700" />
                ) : (
                  <Copy
                    size={15}
                    className={cn(
                      copiedKeyId
                        ? "text-green-700"
                        : "dark:text-white text-muted-foreground",
                    )}
                  />
                )}
              </TooltipInfo>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
