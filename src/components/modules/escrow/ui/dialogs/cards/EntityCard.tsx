"use client";

import type { User } from "@/@types/user.entity";
import { getUserByWallet } from "@/components/modules/auth/server/authentication.firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useEffect, useState } from "react";
import Link from "next/link";

interface EntityCardProps {
  entity?: string;
  type: string;
  hasPercentage?: boolean;
  hasAmount?: boolean;
  percentage?: string;
  amount?: string;
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
  const { formatAddress, formatDollar } = useFormatUtils();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      if (entity) {
        try {
          const fetchedUser = await getUserByWallet({ address: entity });
          setUser(fetchedUser.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [entity]);

  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex w-full items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {type}
            </span>
            {inDispute && (
              <Badge variant="destructive" className="h-5 text-[10px]">
                In Dispute
              </Badge>
            )}
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
                  {formatDollar(amount)}
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
              <Link href={`/public-profile/${entity}`}>
                <span className="text-sm font-medium leading-tight hover:underline">
                  {type === "Trustless Work"
                    ? "Trustless Work"
                    : user && (user.firstName || user.lastName)
                      ? `${user.firstName} ${user.lastName}`
                      : "Unknown"}
                </span>
              </Link>
            )}
            {entity && (
              <Link href={`/public-profile/${entity}`}>
                <span className="text-xs text-muted-foreground hover:underline">
                  {type === "Trustless Work"
                    ? "Private"
                    : formatAddress(entity)}
                </span>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityCard;
