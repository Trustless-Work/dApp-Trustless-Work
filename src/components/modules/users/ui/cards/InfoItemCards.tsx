"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useInfoItem } from "../../hooks/info-item.hook";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  const { truncateAddress, copyToClipboard } = useInfoItem();
  const isAddress = label.toLowerCase() === "address";
  const displayValue = isAddress ? truncateAddress(value) : value;

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
          <span className="text-foreground">{displayValue}</span>
          {isAddress && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => copyToClipboard(value)}
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
