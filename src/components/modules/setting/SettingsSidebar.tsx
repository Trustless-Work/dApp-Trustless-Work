"use client";

import { useRouter } from "next/navigation";
import { User, Settings, Key, ArrowBigLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useIsMobile from "@/hooks/mobile.hook";

interface SettingsSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const settingsNavItems = [
  {
    id: "profile",
    title: "settings.sidebar.profile",
    icon: User,
  },
  {
    id: "preferences",
    title: "settings.sidebar.preferences",
    icon: Settings,
  },
  {
    id: "api-keys",
    title: "settings.sidebar.apiKeys",
    icon: Key,
  },
  {
    id: "go-back",
    title: "settings.sidebar.goBack",
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
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation();

  const handleTabClick = (tabId: string) => {
    if (tabId === "go-back") {
      router.push("/dashboard");
      return;
    }

    if (isMobile) {
      toggleSidebar();
    }

    onTabChange(tabId);
  };

  // Extract the complex inline logic into a helper at the top of the file
  const getSidebarButtonStyles = (isActive: boolean, theme: string) => {
    const baseStyles = "w-full justify-start p-3 rounded-lg transition-colors";
    if (isActive) {
      return theme === "dark"
        ? `${baseStyles} !bg-gray-700 !text-white hover:!bg-gray-700`
        : `${baseStyles} !bg-gray-200 !text-black hover:!bg-gray-200`;
    }
    return theme === "dark"
      ? `${baseStyles} !text-gray-300 hover:!bg-gray-800 hover:!text-white`
      : `${baseStyles} !text-gray-700 hover:!bg-gray-100 hover:!text-black`;
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
                    className={getSidebarButtonStyles(
                      currentTab === item.id,
                      theme,
                    )}
                    aria-current={currentTab === item.id ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{t(item.title)}</span>
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
