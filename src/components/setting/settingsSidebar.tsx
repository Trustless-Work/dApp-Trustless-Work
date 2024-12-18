"use client";

import { useThemeStore } from "@/store/themeStore/store";

interface SettingsSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsSidebar({
  currentTab,
  onTabChange,
}: SettingsSidebarProps) {
  const { theme } = useThemeStore();

  return (
    <aside
      className={`w-64 h-full rounded-xl p-4 ${
        theme === "dark" ? " bg-zinc-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <nav className="flex flex-col gap-4">
        <button
          onClick={() => onTabChange("profile")}
          className={`text-left p-2 rounded ${
            currentTab === "profile"
              ? theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
              : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-200"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => onTabChange("appearance")}
          className={`text-left p-2 rounded ${
            currentTab === "appearance"
              ? theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
              : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-200"
          }`}
        >
          Appearance
        </button>
        <button
          onClick={() => onTabChange("preferences")}
          className={`text-left p-2 rounded ${
            currentTab === "preferences"
              ? theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
              : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-200"
          }`}
        >
          Preference
        </button>
      </nav>
    </aside>
  );
}
