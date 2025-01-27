import { User } from "@/@types/user.entity";
import { getUserByWallet } from "@/components/modules/auth/server/authentication-firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useEffect, useState } from "react";

interface EntityCardProps {
  entity?: string;
  type: string;
  hasPercentage?: boolean;
  hasAmount?: boolean;
  percentage?: string;
  amount?: string;
  inDispute?: boolean;
}

const EntityCard = ({
  entity,
  type,
  hasPercentage,
  hasAmount,
  percentage,
  amount,
  inDispute,
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
    <div className="flex flex-col w-full">
      <div className="text-xs ml-2 mb-2 flex justify-between">
        <span className={`${inDispute ? "text-destructive" : ""}`}>{type}</span>
        <div className="flex gap-3">
          {hasPercentage && (
            <div className="flex">
              <p className="mr-1 font-bold">Fee:</p>
              <span className="text-green-700">{percentage}%</span>
            </div>
          )}
          {hasAmount && (
            <div className="flex">
              <p className="mr-1 font-bold">Amount:</p>
              <span className="text-green-700">{formatDollar(amount)}</span>
            </div>
          )}
        </div>
      </div>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          {type === "Trustless Work" ? (
            <AvatarImage src="/logo.png" alt="Trustless Work Logo" />
          ) : user?.profileImage ? (
            <AvatarImage
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
            />
          ) : (
            <AvatarFallback className="rounded-lg">
              {user?.firstName?.[0] || "?"}
              {user?.lastName?.[0] || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          {type === "Trustless Work" ? (
            <>
              <span className="truncate text-xs font-semibold">
                Trustless Work
              </span>
              <span className="truncate text-xs">Private</span>
            </>
          ) : (
            <>
              <span className="truncate text-xs font-semibold">
                {user && (user.firstName || user.lastName)
                  ? `${user.firstName} ${user.lastName}`
                  : "Unknown"}
              </span>

              <span className="truncate text-xs">{formatAddress(entity)}</span>
            </>
          )}
        </div>
      </SidebarMenuButton>
    </div>
  );
};

export default EntityCard;
