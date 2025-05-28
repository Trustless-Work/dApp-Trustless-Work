"use client";

import * as React from "react";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import TeamSwitcher from "@/components/layout/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ItemsSidebar } from "@/components/layout/sidebar/constants/sidebar-items.constant";
import NavMain from "./nav-main";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={ItemsSidebar.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={ItemsSidebar.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
