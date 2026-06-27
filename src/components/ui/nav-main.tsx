"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type {
  DashboardNavGroup,
  DashboardNavItem,
  DashboardNavSubItem,
} from "@/constants/navigation";
import { ArrowUpRightIcon, ChevronRightIcon } from "lucide-react";

function isPathActive(pathname: string, url: string): boolean {
  if (url === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

function isCollapsibleActive(
  pathname: string,
  item: DashboardNavItem,
): boolean {
  return (
    item.items?.some(
      (subItem) => !subItem.external && isPathActive(pathname, subItem.url),
    ) ?? false
  );
}

function NavSubMenuItem({ item }: { item: DashboardNavSubItem }) {
  const Icon = item.icon;

  if (item.external) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild size="sm">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Icon />
            <span>{item.title}</span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild size="sm" isActive={false}>
        <Link href={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function NavCollapsibleItem({
  item,
  pathname,
}: {
  item: DashboardNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const isActive = isCollapsibleActive(pathname, item);

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            <Icon />
            <span>{item.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <NavSubMenuItem key={subItem.title} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavLinkItem({
  item,
  pathname,
}: {
  item: DashboardNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const isActive = isPathActive(pathname, item.url);

  if (item.external) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Icon />
            <span>{item.title}</span>
            <ArrowUpRightIcon className="ml-auto size-3.5 text-muted-foreground" />
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavGroup({
  group,
  pathname,
}: {
  group: DashboardNavGroup;
  pathname: string;
}) {
  const showLabel = group.showLabel ?? true;

  return (
    <SidebarGroup>
      {showLabel ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {group.items.map((item) =>
          item.items?.length ? (
            <NavCollapsibleItem
              key={item.title}
              item={item}
              pathname={pathname}
            />
          ) : (
            <NavLinkItem key={item.title} item={item} pathname={pathname} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain({ groups }: { groups: DashboardNavGroup[] }) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <NavGroup key={group.label} group={group} pathname={pathname} />
      ))}
    </>
  );
}
