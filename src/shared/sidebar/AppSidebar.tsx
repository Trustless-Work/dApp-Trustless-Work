"use client";

import * as React from "react";
import { NavUser } from "@/shared/sidebar/NavUser";
import TeamSwitcher from "@/shared/sidebar/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/ui/sidebar";
import { ItemsSidebar } from "@/constants/sidebar-items.constant";
import NavMain from "./NavMain";

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
