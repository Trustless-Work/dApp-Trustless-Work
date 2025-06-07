"use client";

import { User, Palette, Settings, Key } from "lucide-react";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface SettingsNavigationMenuProps {
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

const SettingsNavigationMenu = ({
  currentTab,
  onTabChange,
  className,
}: SettingsNavigationMenuProps) => {
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <aside
      className={`h-auto lg:h-full rounded-xl p-4 ${className} ${
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-gray-100 text-black"
      }`}
      role="navigation"
      aria-label="Settings navigation"
    >
      <NavigationMenu viewport={false} className="w-full max-w-none">
        <NavigationMenuList className="flex-col gap-2 lg:gap-4 items-stretch w-full">
          {settingsNavItems.map((item) => (
            <NavigationMenuItem key={item.id} className="w-full">
              <NavigationMenuLink
                data-active={currentTab === item.id}
                className={`w-full text-left p-2 rounded cursor-pointer transition-colors ${
                  currentTab === item.id
                    ? theme === "dark"
                      ? "!bg-gray-700 !text-white"
                      : "!bg-gray-300 !text-black"
                    : theme === "dark"
                      ? "hover:!bg-gray-800 !text-white"
                      : "hover:!bg-gray-200 !text-black"
                }`}
                onClick={() => handleTabClick(item.id)}
                onKeyDown={(event) => handleKeyDown(event, item.id)}
                tabIndex={0}
                role="button"
                aria-label={`Navigate to ${item.title} settings`}
                aria-current={currentTab === item.id ? "page" : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className="h-4 w-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

export default SettingsNavigationMenu;
