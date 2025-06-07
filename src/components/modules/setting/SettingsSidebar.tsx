"use client";

import { User, Palette, Settings, Key } from "lucide-react";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SettingsSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const settingsNavItems = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
  },
  {
    id: "preferences",
    title: "Preferences",
    icon: Settings,
  },
  {
    id: "api-keys",
    title: "API Keys",
    icon: Key,
  },
];

const SettingsSidebar = ({
  currentTab,
  onTabChange,
  className,
}: SettingsSidebarProps) => {
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <aside
      className={`h-auto rounded-xl p-4 ${className} ${
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-gray-100 text-black"
      }`}
      role="navigation"
      aria-label="Settings navigation"
    >
      <Sidebar collapsible="none" className="w-full border-none bg-transparent">
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2 lg:gap-4">
                {settingsNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleTabClick(item.id)}
                      isActive={currentTab === item.id}
                      className={`w-full justify-start p-2 rounded transition-colors ${
                        currentTab === item.id
                          ? theme === "dark"
                            ? "!bg-gray-700 !text-white hover:!bg-gray-700"
                            : "!bg-gray-300 !text-black hover:!bg-gray-300"
                          : theme === "dark"
                            ? "!text-white hover:!bg-gray-800"
                            : "!text-black hover:!bg-gray-200"
                      }`}
                      aria-current={currentTab === item.id ? "page" : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
};

export default SettingsSidebar;
