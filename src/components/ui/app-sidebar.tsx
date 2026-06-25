"use client";

import * as React from "react";

import { NavMain } from "@/components/ui/nav-main";
import { NavSettings } from "@/components/ui/nav-settings";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_GROUPS } from "@/constants/navigation";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={DASHBOARD_NAV_GROUPS} />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <SidebarSeparator />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
