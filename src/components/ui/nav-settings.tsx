"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings2Icon } from "lucide-react";

const SETTINGS_PATH = "/dashboard/settings";

export const NavSettings = () => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(SETTINGS_PATH);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip="Settings">
          <Link href={SETTINGS_PATH}>
            <Settings2Icon />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
