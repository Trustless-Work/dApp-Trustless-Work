"use client";

import type { User } from "@/types/user.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthService } from "@/modules/auth/services/auth.service";
import { formatAddress, formatCurrency } from "@/lib/format";

interface EntityCardProps {
  entity?: string;
  type: string;
  hasPercentage?: boolean;
  hasAmount?: boolean;
  percentage?: number;
  amount?: number;
  inDispute?: boolean;
  isNet?: boolean;
}

const EntityCard = ({
  entity,
  type,
  hasPercentage,
  hasAmount,
  percentage,
  amount,
  inDispute,
  isNet,
}: EntityCardProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      if (entity) {
        try {
          const fetchedUser = await new AuthService().getUser(entity);
          setUser(fetchedUser || undefined);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [entity]);

  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/dashboard/public-profile/${entity}`} target="_blank">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {type}
              </span>
              {inDispute && <Badge variant="destructive">In Dispute</Badge>}
            </div>

            <div className="flex items-center gap-2 text-xs">
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
                  <span className="text-muted-foreground mr-1">
                    {isNet && "Net "}Amount:
                  </span>
                  <span className="font-medium text-emerald-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-9 w-9 rounded-md border">
              {type === "Trustless Work" ? (
                <AvatarImage src="/logo.png" alt="Trustless Work Logo" />
              ) : user?.profileImage ? (
                <AvatarImage
                  src={user.profileImage || "/placeholder.svg"}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              ) : (
                <AvatarFallback className="rounded-md bg-background text-foreground">
                  {user?.firstName?.[0] || "?"}
                  {user?.lastName?.[0] || "?"}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col">
              {entity && (
                <span className="text-sm font-medium leading-tight">
                  {type === "Trustless Work"
                    ? "Trustless Work"
                    : user && (user.firstName || user.lastName)
                      ? `${user.firstName} ${user.lastName}`
                      : "Unknown"}
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

export default EntityCard;
