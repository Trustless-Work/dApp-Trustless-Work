"use client";

import { useEffect } from "react";
import { MoonStar, Sun } from "lucide-react";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

const ThemeToggle = () => {
  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const toggleTheme = useGlobalUIBoundedStore((state) => state.toggleTheme);

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
