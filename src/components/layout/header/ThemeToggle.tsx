"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore/store";
import { MoonStar, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button onClick={() => toggleTheme()}>
      {theme === "dark" ? (
        <Sun className="text-yellow-700" size={30} />
      ) : (
        <MoonStar className="text-gray-700" size={30} />
      )}
    </button>
  );
};

export default ThemeToggle;
