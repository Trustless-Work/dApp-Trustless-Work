"use client";

import * as React from "react";

import { NavMain } from "@/components/ui/nav-main";
import { NavSettings } from "@/components/ui/nav-settings";
import { NavUser } from "@/components/ui/nav-user";
import { OrganizationSwitcher } from "@/components/ui/organization-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_GROUPS } from "@/constants/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={DASHBOARD_NAV_GROUPS} />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <SidebarSeparator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
