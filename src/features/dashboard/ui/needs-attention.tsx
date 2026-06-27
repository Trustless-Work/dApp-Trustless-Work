import {
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Megaphone,
  Plug,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { formatInteger } from "./formater";
import { DashboardCard, DashboardCardTitle } from "./dashboard-card";

const items = [
  {
    title: "Retry failed payments",
    href: "#",
    count: 3,
    icon: <CreditCard aria-hidden="true" strokeWidth={2} />,
  },
  {
    title: "Draft campaigns",
    href: "#",
    count: 5,
    icon: <Megaphone aria-hidden="true" strokeWidth={2} />,
  },
  {
    title: "Webhook delivery errors",
    href: "#",
    count: 1,
    icon: <Plug aria-hidden="true" strokeWidth={2} />,
  },
  {
    title: "Low inventory SKUs",
    href: "#",
    count: 2,
    icon: <AlertTriangle aria-hidden="true" strokeWidth={2} />,
  },
  {
    title: "Unfulfilled orders",
    href: "#",
    count: 12,
    icon: <ShoppingCart aria-hidden="true" strokeWidth={2} />,
  },
] as const;

export function NeedsAttention() {
  return (
    <DashboardCard className="gap-2">
      <DashboardCardTitle>Needs attention</DashboardCardTitle>
      <ItemGroup className="gap-0">
        {items.map((row) => (
          <Item asChild key={row.title} size="sm">
            <a href={row.href}>
              <ItemMedia variant="icon">{row.icon}</ItemMedia>
              <ItemContent className="font-normal text-muted-foreground text-xs">
                <ItemTitle>{row.title}</ItemTitle>
                <ItemDescription className="sr-only">
                  {formatInteger(row.count)} open
                </ItemDescription>
              </ItemContent>
              <ItemActions className="gap-1.5">
                <Badge className="size-6 tabular-nums" variant="secondary">
                  {formatInteger(row.count)}
                </Badge>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={2}
                />
              </ItemActions>
            </a>
          </Item>
        ))}
      </ItemGroup>
    </DashboardCard>
  );
}
