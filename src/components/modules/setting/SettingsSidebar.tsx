"use client";

import { useRouter } from "next/navigation";
import { User, Palette, Settings, Key, ArrowBigLeft } from "lucide-react";
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
  {
    id: "go-back",
    title: "Back",
    icon: ArrowBigLeft,
  },
];

const SettingsSidebar = ({
  currentTab,
  onTabChange,
  className,
}: SettingsSidebarProps) => {
  const router = useRouter();
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const handleTabClick = (tabId: string) => {
    if (tabId === "go-back") {
      router.push("/dashboard");
    }

    onTabChange(tabId);
  };

  return (
    <Sidebar
      collapsible="icon"
      className={`border-r ${className} ${
        theme === "dark"
          ? "bg-zinc-950 border-zinc-800"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <SidebarContent
        className={`${theme === "dark" ? "bg-zinc-950" : "bg-gray-50"}`}
      >
          <SidebarGroup>
            <SidebarGroupContent>
            <SidebarMenu className="gap-2">
                {settingsNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleTabClick(item.id)}
                      isActive={currentTab === item.id}
                    className={`w-full justify-start p-3 rounded-lg transition-colors ${
                        currentTab === item.id
                          ? theme === "dark"
                            ? "!bg-gray-700 !text-white hover:!bg-gray-700"
                          : "!bg-gray-200 !text-black hover:!bg-gray-200"
                          : theme === "dark"
                          ? "!text-gray-300 hover:!bg-gray-800 hover:!text-white"
                          : "!text-gray-700 hover:!bg-gray-100 hover:!text-black"
                      }`}
                      aria-current={currentTab === item.id ? "page" : undefined}
                    >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
};

export default SettingsSidebar;
