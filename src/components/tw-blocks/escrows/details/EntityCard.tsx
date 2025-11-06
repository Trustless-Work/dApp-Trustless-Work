"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { useUserByAddress } from "@/modules/auth/hooks/useUserByAddress";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import Link from "next/link";
import {
  formatAddress,
  formatRole,
} from "@/components/tw-blocks/helpers/format.helper";

interface EntityCardProps {
  entity?: string;
  type: string;
  hasPercentage?: boolean;
  percentage?: number;
  hasAmount?: boolean;
  amount?: number;
  currency?: string;
  inDispute?: boolean;
}

export const EntityCard = ({
  entity,
  type,
  hasPercentage,
  percentage,
  hasAmount,
  amount,
  currency,
  inDispute,
}: EntityCardProps) => {
  const { data: profileImage } = useUserByAddress(entity || null);

  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md py-2">
      <Link href={`/dashboard/public-profile/${entity}`} target="_blank">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex w-2/4 items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {formatRole(type)}
              </span>
              {inDispute && <Badge variant="destructive">In Dispute</Badge>}
            </div>

            <div className="flex w-2/4 items-center justify-end gap-2 text-xs">
              {hasPercentage && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">Fee:</span>
                  <span className="font-medium text-emerald-600">
                    {percentage}%
                  </span>
                </div>
              )}
              {hasAmount && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">Amount:</span>
                  <span className="font-medium">
                    {currency ? `${currency} ` : ""}
                    {typeof amount === "number" ? amount.toFixed(2) : "-"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-9 w-9 rounded-md border">
              {profileImage ? (
                <AvatarImage
                  src={profileImage}
                  alt="User avatar"
                  className="rounded-md"
                />
              ) : null}
              <AvatarFallback className="rounded-md bg-background text-foreground">
                {entity?.[0] || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              {entity && (
                <span className="text-sm font-medium leading-tight">
                  {formatAddress(entity)}
                </span>
              )}
              {entity && (
                <span className="text-xs text-muted-foreground">
                  {type === "Trustless Work"
                    ? "Private"
                    : formatAddress(entity)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
