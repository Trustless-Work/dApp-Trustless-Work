import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface EntityCardProps {
  entity: string;
  type: string;
  hasPercentage?: boolean;
  percentage?: string;
  inDispute?: boolean;
}

const EntityCard = ({
  entity,
  type,
  hasPercentage,
  percentage,
  inDispute,
}: EntityCardProps) => {
  const { formatAddress } = useFormatUtils();

  return (
    <div className={`flex flex-col w-full`}>
      <h3 className="font-bold text-xs ml-2 mb-2 flex justify-between">
        <span className={`${inDispute && "text-destructive"}`}>{type}</span>
        {hasPercentage && (
          <span className="text-green-700 font-black">{percentage}%</span>
        )}
      </h3>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={""} alt={"name"} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-xs font-semibold">{"name"}</span>
          <span className="truncate text-xs">{formatAddress(entity)}</span>
        </div>
      </SidebarMenuButton>
    </div>
  );
};

export default EntityCard;
