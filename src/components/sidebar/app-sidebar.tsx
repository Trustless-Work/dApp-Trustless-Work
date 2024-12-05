"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { FaStackOverflow } from "react-icons/fa";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Trustless Work",
      logo: "/logo.png",
      plan: "Escrows as a service",
    },
  ],
  navMain: [
    {
      title: "Escrows",
      url: "#",
      icon: FaStackOverflow,
      isActive: true,
      items: [
        { title: "Initialize Escrow", url: "initialize-escrow" },
        { title: "Fund Escrow", url: "fund-escrow" },
        { title: "Complete Escrow", url: "complete-escrow" },
        {
          title: "Claim Escrow Earnings",
          url: "claim-escrow-earnings",
        },
        { title: "Cancel Escrow", url: "cancel-escrow" },
        {
          title: "Refund Remaining Funds",
          url: "refund-remaining-funds",
        },
        { title: "Get Engagement", url: "get-engagement" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "API Documentation",
          url: "https://docs.trustlesswork.com/trustless-work",
          isExternal: true,
        },
        {
          title: "Website",
          url: "https://www.trustlesswork.com/",
          isExternal: true,
        },
      ],
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
