import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useFormatUtils } from "@/utils/hook/format.hook";

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

  return (
    <div className={`flex flex-col w-full`}>
      <div className="text-xs ml-2 mb-2 flex justify-between">
        <span className={`${inDispute && "text-destructive"}`}>{type}</span>

        <div className="flex gap-3">
          <div className="flex">
            <p className="mr-1 font-bold">Fee:</p>
            {hasPercentage && <span>{percentage}%</span>}
          </div>
          <div className="flex">
            <p className="mr-1 font-bold">Amount:</p>
            {hasAmount && <span>{formatDollar(amount)}</span>}
          </div>
        </div>
      </div>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          {type === "Trustless Work" ? (
            <AvatarImage src={"/logo.png"} alt={"name"} />
          ) : (
            <>
              <AvatarImage src={""} alt={"name"} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </>
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
              <span className="truncate text-xs font-semibold">{"name"}</span>
              <span className="truncate text-xs">{formatAddress(entity)}</span>
            </>
          )}
        </div>
      </SidebarMenuButton>
    </div>
  );
};

export default EntityCard;
