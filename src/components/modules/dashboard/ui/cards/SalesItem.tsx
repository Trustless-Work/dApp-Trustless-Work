import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SaleItem } from "./RecentSales";
import { useFormatUtils } from "@/utils/hook/format.hook";

const SalesItem = ({ sale, i }: { sale: SaleItem; i: number }) => {
  const { formatDollar } = useFormatUtils();

  return (
    <div key={i} className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={sale.avatarSrc} alt={sale.name} />
        <AvatarFallback>
          {sale.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium">{sale.name}</p>
        <p className="text-sm text-muted-foreground">{sale.email}</p>
      </div>
      <div className="ml-auto font-medium">{formatDollar(sale.amount)}</div>
    </div>
  );
};

export default SalesItem;
